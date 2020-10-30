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

/* eslint-disable no-console */
import type {
    OnEventResponse,
} from "@aws-cdk/custom-resources/lib/provider-framework/types";

import * as AWS from 'aws-sdk';
import {APIVersions} from "aws-sdk/lib/config";
import {ServiceConfigurationOptions} from "aws-sdk/lib/service";
import {ResourceRecords} from "aws-sdk/clients/route53";

const AWS_API_VERSION = '2013-04-01';

/**
 * Assume role and return Route53 client with credentials to that role
 * @param roleArn
 * @param roleSessionName
 */
async function assumeRoleAndGetRoute53Client(roleArn: string, roleSessionName: string) {

    const params: ServiceConfigurationOptions & Pick<APIVersions, 'apiVersion'> = {
        apiVersion: AWS_API_VERSION,
    };

    const sts = new AWS.STS();

    params.credentials = await sts
        .assumeRole({
            RoleArn: roleArn,
            RoleSessionName: roleSessionName,
        })
        .promise()
        .then(({Credentials}) => ({
            accessKeyId: Credentials!.AccessKeyId,
            secretAccessKey: Credentials!.SecretAccessKey,
            sessionToken: Credentials!.SessionToken,
            expiration: Credentials!.Expiration,
        }));

    return new AWS.Route53(params);
}

enum Route53ChangeAction {
    UPSERT = "UPSERT",
    DELETE = "DELETE",
}

interface ChangeRecordParams {
    route53: AWS.Route53;
    targetHostedZoneId: string;
    recordName: string;
    toDelegateNameServers: string[];
    changeAction: Route53ChangeAction;
}

/**
 * Change the NS record of given parameter to the given name
 * `changeAction` field could be either UPSERT or DELETE
 * @param params: ChangeRecordParam
 */
async function changeRecord(params: ChangeRecordParams) {
    const {
        route53,
        targetHostedZoneId,
        recordName,
        toDelegateNameServers,
        changeAction
    } = params;

    const resourceRecords: ResourceRecords = toDelegateNameServers.map((nameServer: string) => {
        return {"Value": nameServer};
    });

    try {
        const response = await route53.changeResourceRecordSets({
            HostedZoneId: targetHostedZoneId,
            ChangeBatch: {
                'Changes': [
                    {
                        "Action": changeAction,
                        "ResourceRecordSet": {
                            "Name": recordName,
                            "Type": "NS",
                            "TTL": 300,
                            "ResourceRecords": resourceRecords,
                        }
                    }
                ]
            }
        }).promise();
        console.log("response = ", response.ChangeInfo.Id);

    } catch (e) {
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
export async function onEventHandler(
    event: any
): Promise<OnEventResponse> {
    console.log("Event: %j", event);

    const {
        targetAccount,
        targetRoleToAssume,
        targetHostedZoneId,
        toDelegateNameServers,
        recordName,
    } = event.ResourceProperties;

    let physicalResourceId = `cross-account-record-${targetAccount}-${recordName}`;

    const roleArn = `arn:aws:iam::${targetAccount}:role/${targetRoleToAssume}`;
    const roleSessionName = event.LogicalResourceId.substr(0, 64);
    const route53 = await assumeRoleAndGetRoute53Client(roleArn, roleSessionName);

    console.log("roleArn = ", roleArn);
    console.log("targetHostedZoneId = ", targetHostedZoneId);
    console.log("toDelegateNameServers = ", toDelegateNameServers);
    console.log("recordName = ", recordName);

    const baseChangeRecordProps = {
        route53,
        targetHostedZoneId,
        recordName,
        toDelegateNameServers
    };

    switch (event.RequestType) {
        case "Create":
            await changeRecord({ ...baseChangeRecordProps, changeAction: Route53ChangeAction.UPSERT });
            break;
        case "Update":
            await changeRecord({ ...baseChangeRecordProps, changeAction: Route53ChangeAction.DELETE });
            await changeRecord({ ...baseChangeRecordProps, changeAction: Route53ChangeAction.UPSERT });
            break;
        case "Delete":
            // Delete an existing one
            await changeRecord({ ...baseChangeRecordProps, changeAction: Route53ChangeAction.DELETE });
    }

    return {
        PhysicalResourceId: physicalResourceId,
    };

}
