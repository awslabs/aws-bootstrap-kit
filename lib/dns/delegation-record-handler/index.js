"use strict";
/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEventHandler = void 0;
const AWS = require("aws-sdk");
const utils_1 = require("./utils");
const AWS_API_VERSION = "2013-04-01";
/**
 * Assume role and return Route53 client with credentials to that role
 * @param roleArn
 * @param roleSessionName
 */
async function assumeRoleAndGetRoute53Client(roleArn, roleSessionName) {
    const params = {
        apiVersion: AWS_API_VERSION,
    };
    const sts = new AWS.STS();
    params.credentials = await sts
        .assumeRole({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName,
    })
        .promise()
        .then(({ Credentials }) => ({
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
        expiration: Credentials.Expiration,
    }));
    return new AWS.Route53(params);
}
var Route53ChangeAction;
(function (Route53ChangeAction) {
    Route53ChangeAction["UPSERT"] = "UPSERT";
    Route53ChangeAction["DELETE"] = "DELETE";
})(Route53ChangeAction || (Route53ChangeAction = {}));
/**
 * Change the NS record of given parameter to the given name
 * `changeAction` field could be either UPSERT or DELETE
 * @param params: ChangeRecordParam
 */
async function changeRecord(params) {
    const { route53, targetHostedZoneId, recordName, toDelegateNameServers, changeAction, } = params;
    const resourceRecords = toDelegateNameServers.map((nameServer) => {
        return { Value: nameServer };
    });
    try {
        const response = await route53
            .changeResourceRecordSets({
            HostedZoneId: targetHostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: changeAction,
                        ResourceRecordSet: {
                            Name: recordName,
                            Type: "NS",
                            TTL: 300,
                            ResourceRecords: resourceRecords,
                        },
                    },
                ],
            },
        })
            .promise();
        console.log("response = ", response.ChangeInfo.Id);
    }
    catch (e) {
        throw e;
    }
}
/**
 * Create/Update/Delete a zone delegation record cross-account, depending on event.RequestType
 * Edge cases:
 * 1. CREATE: If the resource has already existed it will update NS to the given name
 * 2. UPDATE: If the resource is missing (was manually deleted), it will fail.
 * 3. DELETE: If the resource is missing (was manually deleted), it will fail.
 * @param event An event with the following ResourceProperties: targetAccount, targetRoleToAssume, targetHostedZoneId, toDelegateNameServers (string[]), recordName
 * @returns Returns a PhysicalResourceId corresponding to record id
 */
async function onEventHandler(event) {
    console.log("Event: %j", event);
    const { targetAccount, targetRoleToAssume, targetHostedZoneId, toDelegateNameServers, recordName, currentAccountId } = event.ResourceProperties;
    const roleArn = targetAccount && targetRoleToAssume
        ? `arn:aws:iam::${targetAccount}:role/${targetRoleToAssume}`
        : await resolveRoleArn(recordName, currentAccountId);
    const roleSessionName = event.LogicalResourceId.substr(0, 64);
    const route53 = await assumeRoleAndGetRoute53Client(roleArn, roleSessionName);
    const _targetHostedZoneId = targetHostedZoneId ? targetHostedZoneId : await resolveParentHostedZoneId(route53, recordName);
    console.log("roleArn = ", roleArn);
    console.log("targetHostedZoneId = ", _targetHostedZoneId);
    console.log("toDelegateNameServers = ", toDelegateNameServers);
    console.log("recordName = ", recordName);
    const baseChangeRecordProps = {
        route53,
        targetHostedZoneId: _targetHostedZoneId,
        recordName,
        toDelegateNameServers,
    };
    switch (event.RequestType) {
        case "Create":
            await changeRecord({
                ...baseChangeRecordProps,
                changeAction: Route53ChangeAction.UPSERT,
            });
            break;
        case "Update":
            await changeRecord({
                ...baseChangeRecordProps,
                changeAction: Route53ChangeAction.DELETE,
            });
            await changeRecord({
                ...baseChangeRecordProps,
                changeAction: Route53ChangeAction.UPSERT,
            });
            break;
        case "Delete":
            // Delete an existing one
            await changeRecord({
                ...baseChangeRecordProps,
                changeAction: Route53ChangeAction.DELETE,
            });
    }
    let physicalResourceId = `cross-account-record-${targetAccount ? targetAccount : roleArn.split(':')[4]}-${recordName}`;
    return {
        PhysicalResourceId: physicalResourceId,
    };
}
exports.onEventHandler = onEventHandler;
/**
 * A function in charge of resolving the hosted zone Id from a sub domain  (i.e. if 'app1.dev.yourdomain.com' is given, dev.yourdomain.com zone id will be returned)
 * @param recordName The full DNS record name which will be stripped to extract the parent dns zone name used to resolved the zone id
 * @returns ParentHostedZoneId
 */
async function resolveParentHostedZoneId(route53Client, recordName) {
    const listHostedZoneByNameResult = await route53Client.listHostedZonesByName({
        DNSName: recordName.split(".").splice(1).join(".")
    }).promise();
    return listHostedZoneByNameResult.HostedZones[0].Id;
}
/**
 * A function used to resolve the role ARN capable of modifying a DNS sub zone in a remote account
 * @param recordName The full DNS record name which will be stripped to resolve the second part of the role name
 * @param currentAccountId the current account Id used to resolve the first part of the role name
 */
async function resolveRoleArn(recordName, currentAccountId) {
    try {
        const orgClient = new AWS.Organizations({ region: "us-east-1" });
        const listAccountsResults = await orgClient.listAccounts().promise();
        let targetAccountId;
        let targetRoleToAssume;
        for (const account of listAccountsResults.Accounts
            ? listAccountsResults.Accounts
            : []) {
            // Indentify main account which is the one hosting DNS root domain
            if (account.JoinedMethod === "INVITED") {
                targetAccountId = account.Id;
            }
            else if (account.Id == currentAccountId) {
                targetRoleToAssume = utils_1.getDNSUpdateRoleNameFromServiceRecordName(recordName);
            }
        }
        const roleArn = `arn:aws:iam::${targetAccountId}:role/${targetRoleToAssume}`;
        return roleArn;
    }
    catch (error) {
        console.error(`Failed to resolveRoleArn due to ${error}`);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7OztBQUtGLCtCQUErQjtBQUsvQixtQ0FBa0U7QUFFbEUsTUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDO0FBRXJDOzs7O0dBSUc7QUFDSCxLQUFLLFVBQVUsNkJBQTZCLENBQ3hDLE9BQWUsRUFDZixlQUF1QjtJQUV2QixNQUFNLE1BQU0sR0FDMEI7UUFDbEMsVUFBVSxFQUFFLGVBQWU7S0FDOUIsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRTFCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxHQUFHO1NBQ3pCLFVBQVUsQ0FBQztRQUNSLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGVBQWUsRUFBRSxlQUFlO0tBQ25DLENBQUM7U0FDRCxPQUFPLEVBQUU7U0FDVCxJQUFJLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLFdBQVcsRUFBRSxXQUFZLENBQUMsV0FBVztRQUNyQyxlQUFlLEVBQUUsV0FBWSxDQUFDLGVBQWU7UUFDN0MsWUFBWSxFQUFFLFdBQVksQ0FBQyxZQUFZO1FBQ3ZDLFVBQVUsRUFBRSxXQUFZLENBQUMsVUFBVTtLQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVSLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxJQUFLLG1CQUdKO0FBSEQsV0FBSyxtQkFBbUI7SUFDcEIsd0NBQWlCLENBQUE7SUFDakIsd0NBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUhJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFHdkI7QUFVRDs7OztHQUlHO0FBQ0gsS0FBSyxVQUFVLFlBQVksQ0FBQyxNQUEwQjtJQUNsRCxNQUFNLEVBQ0YsT0FBTyxFQUNQLGtC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RUFBRSxDQUFDO1FBQ3JFLElBQUksZUFBZSxDQUFDO1FBQ3BCLElBQUksa0JBQWtCLENBQUM7UUFDdkIsS0FBSyxNQUFNLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxRQUFRO1lBQzlDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRO1lBQzlCLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFFTixrRUFBa0U7WUFDbEUsSUFBSSxPQUFPLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtnQkFDcEMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDaEM7aUJBQU0sSUFBSSxPQUFPLENBQUMsRUFBRSxJQUFJLGdCQUFnQixFQUFFO2dCQUV6QyxrQkFBa0IsR0FBRyxpREFBeUMsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM1RTtTQUNKO1FBQ0QsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLGVBQWUsU0FBUyxrQkFBa0IsRUFBRSxDQUFDO1FBQzdFLE9BQU8sT0FBTyxDQUFDO0tBQ2xCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzFELE1BQU0sS0FBSyxDQUFDO0tBQ2Y7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkNvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB0eXBlIHsgT25FdmVudFJlc3BvbnNlIH0gZnJvbSBcIkBhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMvbGliL3Byb3ZpZGVyLWZyYW1ld29yay90eXBlc1wiO1xuXG5pbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGtcIjtcbmltcG9ydCB7IEFQSVZlcnNpb25zIH0gZnJvbSBcImF3cy1zZGsvbGliL2NvbmZpZ1wiO1xuaW1wb3J0IHsgU2VydmljZUNvbmZpZ3VyYXRpb25PcHRpb25zIH0gZnJvbSBcImF3cy1zZGsvbGliL3NlcnZpY2VcIjtcbmltcG9ydCB7IFJlc291cmNlUmVjb3JkcyB9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvcm91dGU1M1wiO1xuaW1wb3J0IFJvdXRlNTMgPSByZXF1aXJlKFwiYXdzLXNkay9jbGllbnRzL3JvdXRlNTNcIik7XG5pbXBvcnQge2dldEROU1VwZGF0ZVJvbGVOYW1lRnJvbVNlcnZpY2VSZWNvcmROYW1lfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgQVdTX0FQSV9WRVJTSU9OID0gXCIyMDEzLTA0LTAxXCI7XG5cbi8qKlxuICogQXNzdW1lIHJvbGUgYW5kIHJldHVybiBSb3V0ZTUzIGNsaWVudCB3aXRoIGNyZWRlbnRpYWxzIHRvIHRoYXQgcm9sZVxuICogQHBhcmFtIHJvbGVBcm5cbiAqIEBwYXJhbSByb2xlU2Vzc2lvbk5hbWVcbiAqL1xuYXN5bmMgZnVuY3Rpb24gYXNzdW1lUm9sZUFuZEdldFJvdXRlNTNDbGllbnQoXG4gICAgcm9sZUFybjogc3RyaW5nLFxuICAgIHJvbGVTZXNzaW9uTmFtZTogc3RyaW5nXG4pIHtcbiAgICBjb25zdCBwYXJhbXM6IFNlcnZpY2VDb25maWd1cmF0aW9uT3B0aW9ucyAmXG4gICAgICAgIFBpY2s8QVBJVmVyc2lvbnMsIFwiYXBpVmVyc2lvblwiPiA9IHtcbiAgICAgICAgYXBpVmVyc2lvbjogQVdTX0FQSV9WRVJTSU9OLFxuICAgIH07XG5cbiAgICBjb25zdCBzdHMgPSBuZXcgQVdTLlNUUygpO1xuXG4gICAgcGFyYW1zLmNyZWRlbnRpYWxzID0gYXdhaXQgc3RzXG4gICAgICAgIC5hc3N1bWVSb2xlKHtcbiAgICAgICAgICAgIFJvbGVBcm46IHJvbGVBcm4sXG4gICAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IHJvbGVTZXNzaW9uTmFtZSxcbiAgICAgICAgfSlcbiAgICAgICAgLnByb21pc2UoKVxuICAgICAgICAudGhlbigoeyBDcmVkZW50aWFscyB9KSA9PiAoe1xuICAgICAgICAgICAgYWNjZXNzS2V5SWQ6IENyZWRlbnRpYWxzIS5BY2Nlc3NLZXlJZCxcbiAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogQ3JlZGVudGlhbHMhLlNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgICAgIHNlc3Npb25Ub2tlbjogQ3JlZGVudGlhbHMhLlNlc3Npb25Ub2tlbixcbiAgICAgICAgICAgIGV4cGlyYXRpb246IENyZWRlbnRpYWxzIS5FeHBpcmF0aW9uLFxuICAgICAgICB9KSk7XG5cbiAgICByZXR1cm4gbmV3IEFXUy5Sb3V0ZTUzKHBhcmFtcyk7XG59XG5cbmVudW0gUm91dGU1M0NoYW5nZUFjdGlvbiB7XG4gICAgVVBTRVJUID0gXCJVUFNFUlRcIixcbiAgICBERUxFVEUgPSBcIkRFTEVURVwiLFxufVxuXG5pbnRlcmZhY2UgQ2hhbmdlUmVjb3JkUGFyYW1zIHtcbiAgICByb3V0ZTUzOiBBV1MuUm91dGU1MztcbiAgICB0YXJnZXRIb3N0ZWRab25lSWQ6IHN0cmluZztcbiAgICByZWNvcmROYW1lOiBzdHJpbmc7XG4gICAgdG9EZWxlZ2F0ZU5hbWVTZXJ2ZXJzOiBzdHJpbmdbXTtcbiAgICBjaGFuZ2VBY3Rpb246IFJvdXRlNTNDaGFuZ2VBY3Rpb247XG59XG5cbi8qKlxuICogQ2hhbmdlIHRoZSBOUyByZWNvcmQgb2YgZ2l2ZW4gcGFyYW1ldGVyIHRvIHRoZSBnaXZlbiBuYW1lXG4gKiBgY2hhbmdlQWN0aW9uYCBmaWVsZCBjb3VsZCBiZSBlaXRoZXIgVVBTRVJUIG9yIERFTEVURVxuICogQHBhcmFtIHBhcmFtczogQ2hhbmdlUmVjb3JkUGFyYW1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gY2hhbmdlUmVjb3JkKHBhcmFtczogQ2hhbmdlUmVjb3JkUGFyYW1zKSB7XG4gICAgY29uc3Qge1xuICAgICAgICByb3V0ZTUzLFxuICAgICAgICB0YXJnZXRIb3N0ZWRab25lSWQsXG4gICAgICAgIHJlY29yZE5hbWUsXG4gICAgICAgIHRvRGVsZWdhdGVOYW1lU2VydmVycyxcbiAgICAgICAgY2hhbmdlQWN0aW9uLFxuICAgIH0gPSBwYXJhbXM7XG5cbiAgICBjb25zdCByZXNvdXJjZVJlY29yZHM6IFJlc291cmNlUmVjb3JkcyA9IHRvRGVsZWdhdGVOYW1lU2VydmVycy5tYXAoXG4gICAgICAgIChuYW1lU2VydmVyOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IFZhbHVlOiBuYW1lU2VydmVyIH07XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByb3V0ZTUzXG4gICAgICAgICAgICAuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICAgICAgICAgICAgICBIb3N0ZWRab25lSWQ6IHRhcmdldEhvc3RlZFpvbmVJZCxcbiAgICAgICAgICAgICAgICBDaGFuZ2VCYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBjaGFuZ2VBY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VSZWNvcmRTZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTmFtZTogcmVjb3JkTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHlwZTogXCJOU1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUVEw6IDMwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VSZWNvcmRzOiByZXNvdXJjZVJlY29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucHJvbWlzZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlID0gXCIsIHJlc3BvbnNlLkNoYW5nZUluZm8uSWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG59XG5cbi8qKlxuICogQ3JlYXRlL1VwZGF0ZS9EZWxldGUgYSB6b25lIGRlbGVnYXRpb24gcmVjb3JkIGNyb3NzLWFjY291bnQsIGRlcGVuZGluZyBvbiBldmVudC5SZXF1ZXN0VHlwZVxuICogRWRnZSBjYXNlczpcbiAqIDEuIENSRUFURTogSWYgdGhlIHJlc291cmNlIGhhcyBhbHJlYWR5IGV4aXN0ZWQgaXQgd2lsbCB1cGRhdGUgTlMgdG8gdGhlIGdpdmVuIG5hbWVcbiAqIDIuIFVQREFURTogSWYgdGhlIHJlc291cmNlIGlzIG1pc3NpbmcgKHdhcyBtYW51YWxseSBkZWxldGVkKSwgaXQgd2lsbCBmYWlsLlxuICogMy4gREVMRVRFOiBJZiB0aGUgcmVzb3VyY2UgaXMgbWlzc2luZyAod2FzIG1hbnVhbGx5IGRlbGV0ZWQpLCBpdCB3aWxsIGZhaWwuXG4gKiBAcGFyYW0gZXZlbnQgQW4gZXZlbnQgd2l0aCB0aGUgZm9sbG93aW5nIFJlc291cmNlUHJvcGVydGllczogdGFyZ2V0QWNjb3VudCwgdGFyZ2V0Um9sZVRvQXNzdW1lLCB0YXJnZXRIb3N0ZWRab25lSWQsIHRvRGVsZWdhdGVOYW1lU2VydmVycyAoc3RyaW5nW10pLCByZWNvcmROYW1lXG4gKiBAcmV0dXJucyBSZXR1cm5zIGEgUGh5c2ljYWxSZXNvdXJjZUlkIGNvcnJlc3BvbmRpbmcgdG8gcmVjb3JkIGlkXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvbkV2ZW50SGFuZGxlcihldmVudDogYW55KTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZyhcIkV2ZW50OiAlalwiLCBldmVudCk7XG5cbiAgICBjb25zdCB7XG4gICAgICAgIHRhcmdldEFjY291bnQsXG4gICAgICAgIHRhcmdldFJvbGVUb0Fzc3VtZSxcbiAgICAgICAgdGFyZ2V0SG9zdGVkWm9uZUlkLFxuICAgICAgICB0b0RlbGVnYXRlTmFtZVNlcnZlcnMsXG4gICAgICAgIHJlY29yZE5hbWUsXG4gICAgICAgIGN1cnJlbnRBY2NvdW50SWRcbiAgICB9ID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzO1xuXG5cbiAgICBjb25zdCByb2xlQXJuID1cbiAgICAgICAgdGFyZ2V0QWNjb3VudCAmJiB0YXJnZXRSb2xlVG9Bc3N1bWVcbiAgICAgICAgICAgID8gYGFybjphd3M6aWFtOjoke3RhcmdldEFjY291bnR9OnJvbGUvJHt0YXJnZXRSb2xlVG9Bc3N1bWV9YFxuICAgICAgICAgICAgOiBhd2FpdCByZXNvbHZlUm9sZUFybihyZWNvcmROYW1lLCBjdXJyZW50QWNjb3VudElkKTtcblxuICAgIGNvbnN0IHJvbGVTZXNzaW9uTmFtZSA9IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLnN1YnN0cigwLCA2NCk7XG4gICAgY29uc3Qgcm91dGU1MyA9IGF3YWl0IGFzc3VtZVJvbGVBbmRHZXRSb3V0ZTUzQ2xpZW50KFxuICAgICAgICByb2xlQXJuLFxuICAgICAgICByb2xlU2Vzc2lvbk5hbWVcbiAgICApO1xuICAgIFxuICAgIGNvbnN0IF90YXJnZXRIb3N0ZWRab25lSWQgPSB0YXJnZXRIb3N0ZWRab25lSWQ/dGFyZ2V0SG9zdGVkWm9uZUlkOmF3YWl0IHJlc29sdmVQYXJlbnRIb3N0ZWRab25lSWQocm91dGU1MywgcmVjb3JkTmFtZSk7XG5cbiAgICBjb25zb2xlLmxvZyhcInJvbGVBcm4gPSBcIiwgcm9sZUFybik7XG4gICAgY29uc29sZS5sb2coXCJ0YXJnZXRIb3N0ZWRab25lSWQgPSBcIiwgX3RhcmdldEhvc3RlZFpvbmVJZCk7XG4gICAgY29uc29sZS5sb2coXCJ0b0RlbGVnYXRlTmFtZVNlcnZlcnMgPSBcIiwgdG9EZWxlZ2F0ZU5hbWVTZXJ2ZXJzKTtcbiAgICBjb25zb2xlLmxvZyhcInJlY29yZE5hbWUgPSBcIiwgcmVjb3JkTmFtZSk7XG5cbiAgICBjb25zdCBiYXNlQ2hhbmdlUmVjb3JkUHJvcHMgPSB7XG4gICAgICAgIHJvdXRlNTMsXG4gICAgICAgIHRhcmdldEhvc3RlZFpvbmVJZDogX3RhcmdldEhvc3RlZFpvbmVJZCxcbiAgICAgICAgcmVjb3JkTmFtZSxcbiAgICAgICAgdG9EZWxlZ2F0ZU5hbWVTZXJ2ZXJzLFxuICAgIH07XG5cbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJDcmVhdGVcIjpcbiAgICAgICAgICAgIGF3YWl0IGNoYW5nZVJlY29yZCh7XG4gICAgICAgICAgICAgICAgLi4uYmFzZUNoYW5nZVJlY29yZFByb3BzLFxuICAgICAgICAgICAgICAgIGNoYW5nZUFjdGlvbjogUm91dGU1M0NoYW5nZUFjdGlvbi5VUFNFUlQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiVXBkYXRlXCI6XG4gICAgICAgICAgICBhd2FpdCBjaGFuZ2VSZWNvcmQoe1xuICAgICAgICAgICAgICAgIC4uLmJhc2VDaGFuZ2VSZWNvcmRQcm9wcyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VBY3Rpb246IFJvdXRlNTNDaGFuZ2VBY3Rpb24uREVMRVRFLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCBjaGFuZ2VSZWNvcmQoe1xuICAgICAgICAgICAgICAgIC4uLmJhc2VDaGFuZ2VSZWNvcmRQcm9wcyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VBY3Rpb246IFJvdXRlNTNDaGFuZ2VBY3Rpb24uVVBTRVJULFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkRlbGV0ZVwiOlxuICAgICAgICAgICAgLy8gRGVsZXRlIGFuIGV4aXN0aW5nIG9uZVxuICAgICAgICAgICAgYXdhaXQgY2hhbmdlUmVjb3JkKHtcbiAgICAgICAgICAgICAgICAuLi5iYXNlQ2hhbmdlUmVjb3JkUHJvcHMsXG4gICAgICAgICAgICAgICAgY2hhbmdlQWN0aW9uOiBSb3V0ZTUzQ2hhbmdlQWN0aW9uLkRFTEVURSxcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBwaHlzaWNhbFJlc291cmNlSWQgPSBgY3Jvc3MtYWNjb3VudC1yZWNvcmQtJHt0YXJnZXRBY2NvdW50P3RhcmdldEFjY291bnQ6cm9sZUFybi5zcGxpdCgnOicpWzRdfS0ke3JlY29yZE5hbWV9YDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgIH07XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiBpbiBjaGFyZ2Ugb2YgcmVzb2x2aW5nIHRoZSBob3N0ZWQgem9uZSBJZCBmcm9tIGEgc3ViIGRvbWFpbiAgKGkuZS4gaWYgJ2FwcDEuZGV2LnlvdXJkb21haW4uY29tJyBpcyBnaXZlbiwgZGV2LnlvdXJkb21haW4uY29tIHpvbmUgaWQgd2lsbCBiZSByZXR1cm5lZClcbiAqIEBwYXJhbSByZWNvcmROYW1lIFRoZSBmdWxsIEROUyByZWNvcmQgbmFtZSB3aGljaCB3aWxsIGJlIHN0cmlwcGVkIHRvIGV4dHJhY3QgdGhlIHBhcmVudCBkbnMgem9uZSBuYW1lIHVzZWQgdG8gcmVzb2x2ZWQgdGhlIHpvbmUgaWRcbiAqIEByZXR1cm5zIFBhcmVudEhvc3RlZFpvbmVJZFxuICovXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlUGFyZW50SG9zdGVkWm9uZUlkKHJvdXRlNTNDbGllbnQ6IFJvdXRlNTMsIHJlY29yZE5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGxpc3RIb3N0ZWRab25lQnlOYW1lUmVzdWx0ID0gYXdhaXQgcm91dGU1M0NsaWVudC5saXN0SG9zdGVkWm9uZXNCeU5hbWUoe1xuICAgICAgICBETlNOYW1lOiByZWNvcmROYW1lLnNwbGl0KFwiLlwiKS5zcGxpY2UoMSkuam9pbihcIi5cIilcbiAgICB9KS5wcm9taXNlKCk7XG4gICAgcmV0dXJuIGxpc3RIb3N0ZWRab25lQnlOYW1lUmVzdWx0Lkhvc3RlZFpvbmVzWzBdLklkO1xufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdXNlZCB0byByZXNvbHZlIHRoZSByb2xlIEFSTiBjYXBhYmxlIG9mIG1vZGlmeWluZyBhIEROUyBzdWIgem9uZSBpbiBhIHJlbW90ZSBhY2NvdW50XG4gKiBAcGFyYW0gcmVjb3JkTmFtZSBUaGUgZnVsbCBETlMgcmVjb3JkIG5hbWUgd2hpY2ggd2lsbCBiZSBzdHJpcHBlZCB0byByZXNvbHZlIHRoZSBzZWNvbmQgcGFydCBvZiB0aGUgcm9sZSBuYW1lXG4gKiBAcGFyYW0gY3VycmVudEFjY291bnRJZCB0aGUgY3VycmVudCBhY2NvdW50IElkIHVzZWQgdG8gcmVzb2x2ZSB0aGUgZmlyc3QgcGFydCBvZiB0aGUgcm9sZSBuYW1lXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlc29sdmVSb2xlQXJuKHJlY29yZE5hbWU6IHN0cmluZywgY3VycmVudEFjY291bnRJZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgb3JnQ2xpZW50ID0gbmV3IEFXUy5Pcmdhbml6YXRpb25zKHsgcmVnaW9uOiBcInVzLWVhc3QtMVwiIH0pO1xuICAgICAgICBjb25zdCBsaXN0QWNjb3VudHNSZXN1bHRzID0gYXdhaXQgb3JnQ2xpZW50Lmxpc3RBY2NvdW50cygpLnByb21pc2UoKTtcbiAgICAgICAgbGV0IHRhcmdldEFjY291bnRJZDtcbiAgICAgICAgbGV0IHRhcmdldFJvbGVUb0Fzc3VtZTtcbiAgICAgICAgZm9yIChjb25zdCBhY2NvdW50IG9mIGxpc3RBY2NvdW50c1Jlc3VsdHMuQWNjb3VudHNcbiAgICAgICAgICAgID8gbGlzdEFjY291bnRzUmVzdWx0cy5BY2NvdW50c1xuICAgICAgICAgICAgOiBbXSkgeyAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vIEluZGVudGlmeSBtYWluIGFjY291bnQgd2hpY2ggaXMgdGhlIG9uZSBob3N0aW5nIEROUyByb290IGRvbWFpblxuICAgICAgICAgICAgaWYgKGFjY291bnQuSm9pbmVkTWV0aG9kID09PSBcIklOVklURURcIikge1xuICAgICAgICAgICAgICAgIHRhcmdldEFjY291bnRJZCA9IGFjY291bnQuSWQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjY291bnQuSWQgPT0gY3VycmVudEFjY291bnRJZCkge1xuXG4gICAgICAgICAgICAgIHRhcmdldFJvbGVUb0Fzc3VtZSA9IGdldEROU1VwZGF0ZVJvbGVOYW1lRnJvbVNlcnZpY2VSZWNvcmROYW1lKHJlY29yZE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvbGVBcm4gPSBgYXJuOmF3czppYW06OiR7dGFyZ2V0QWNjb3VudElkfTpyb2xlLyR7dGFyZ2V0Um9sZVRvQXNzdW1lfWA7XG4gICAgICAgIHJldHVybiByb2xlQXJuO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byByZXNvbHZlUm9sZUFybiBkdWUgdG8gJHtlcnJvcn1gKTtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSAgXG59Il19