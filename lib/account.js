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
exports.Account = exports.AccountType = void 0;
const core = require("@aws-cdk/core");
const account_provider_1 = require("./account-provider");
const cr = require("@aws-cdk/custom-resources");
const ssm = require("@aws-cdk/aws-ssm");
var AccountType;
(function (AccountType) {
    AccountType["CICD"] = "CICD";
    AccountType["DNS"] = "DNS";
    AccountType["STAGE"] = "STAGE";
    AccountType["PLAYGROUND"] = "PLAYGROUND";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
/**
 * An AWS Account.
 */
class Account extends core.Construct {
    constructor(scope, id, accountProps) {
        var _a;
        super(scope, id);
        const accountProvider = account_provider_1.AccountProvider.getOrCreate(this);
        let account = new core.CustomResource(this, `Account-${accountProps.name}`, {
            serviceToken: accountProvider.provider.serviceToken,
            resourceType: "Custom::AccountCreation",
            properties: {
                Email: accountProps.email,
                AccountName: accountProps.name,
                AccountType: accountProps.type,
                StageName: accountProps.stageName,
                StageOrder: (_a = accountProps.stageOrder) === null || _a === void 0 ? void 0 : _a.toString(),
                HostedServices: accountProps.hostedServices ? accountProps.hostedServices.join(':') : undefined
            },
        });
        let accountId = account.getAtt("AccountId").toString();
        accountProps.id = accountId;
        this.accountName = accountProps.name;
        this.accountId = accountId;
        this.accountStageName = accountProps.stageName;
        new ssm.StringParameter(this, `${accountProps.name}-AccountDetails`, {
            description: `Details of ${accountProps.name}`,
            parameterName: `/accounts/${accountProps.name}`,
            stringValue: JSON.stringify(accountProps),
        });
        if (accountProps.parentOrganizationalUnitId) {
            let parent = new cr.AwsCustomResource(this, "ListParentsCustomResource", {
                onCreate: {
                    service: "Organizations",
                    action: "listParents",
                    physicalResourceId: cr.PhysicalResourceId.fromResponse("Parents.0.Id"),
                    region: "us-east-1",
                    parameters: {
                        ChildId: accountId,
                    },
                },
                onUpdate: {
                    service: "Organizations",
                    action: "listParents",
                    physicalResourceId: cr.PhysicalResourceId.fromResponse("Parents.0.Id"),
                    region: "us-east-1",
                    parameters: {
                        ChildId: accountId,
                    },
                },
                onDelete: {
                    service: "Organizations",
                    action: "listParents",
                    physicalResourceId: cr.PhysicalResourceId.fromResponse("Parents.0.Id"),
                    region: "us-east-1",
                    parameters: {
                        ChildId: accountId,
                    },
                },
                policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
                }),
            });
            new cr.AwsCustomResource(this, "MoveAccountCustomResource", {
                onCreate: {
                    service: "Organizations",
                    action: "moveAccount",
                    physicalResourceId: cr.PhysicalResourceId.of(accountId),
                    region: "us-east-1",
                    parameters: {
                        AccountId: accountId,
                        DestinationParentId: accountProps.parentOrganizationalUnitId,
                        SourceParentId: parent.getResponseField("Parents.0.Id"),
                    },
                },
                policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                    resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
                }),
            });
            // Enabling Organizations listAccounts call for auto resolution of stages and DNS accounts Ids and Names
            if (accountProps.type === AccountType.CICD) {
                this.registerAsDelegatedAdministrator(accountId, 'ssm.amazonaws.com');
            }
            // else {
            //     // Switching to another principal to workaround the max number of delegated administrators (which is set to 3 by default).
            //     this.registerAsDelegatedAdministrator(accountId, 'config-multiaccountsetup.amazonaws.com');
            // }
        }
    }
    registerAsDelegatedAdministrator(accountId, servicePrincipal) {
        new cr.AwsCustomResource(this, "registerDelegatedAdministrator", {
            onCreate: {
                service: 'Organizations',
                action: 'registerDelegatedAdministrator',
                physicalResourceId: cr.PhysicalResourceId.of('registerDelegatedAdministrator'),
                region: 'us-east-1',
                parameters: {
                    AccountId: accountId,
                    ServicePrincipal: servicePrincipal
                }
            },
            onDelete: {
                service: 'Organizations',
                action: 'deregisterDelegatedAdministrator',
                physicalResourceId: cr.PhysicalResourceId.of('registerDelegatedAdministrator'),
                region: 'us-east-1',
                parameters: {
                    AccountId: accountId,
                    ServicePrincipal: servicePrincipal
                }
            },
            installLatestAwsSdk: false,
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
    }
}
exports.Account = Account;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOzs7QUFFRixzQ0FBc0M7QUFDdEMseURBQXFEO0FBQ3JELGdEQUFnRDtBQUNoRCx3Q0FBd0M7QUE2Q3hDLElBQVksV0FLWDtBQUxELFdBQVksV0FBVztJQUNyQiw0QkFBYSxDQUFBO0lBQ2IsMEJBQVcsQ0FBQTtJQUNYLDhCQUFlLENBQUE7SUFDZix3Q0FBeUIsQ0FBQTtBQUMzQixDQUFDLEVBTFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFLdEI7Ozs7QUFLRCxNQUFhLE9BQVEsU0FBUSxJQUFJLENBQUMsU0FBUztJQVl6QyxZQUFZLEtBQXFCLEVBQUUsRUFBVSxFQUFFLFlBQTJCOztRQUN4RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sZUFBZSxHQUFHLGtDQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFELElBQUksT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FDbkMsSUFBSSxFQUNKLFdBQVcsWUFBWSxDQUFDLElBQUksRUFBRSxFQUM5QjtZQUNFLFlBQVksRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLFlBQVk7WUFDbkQsWUFBWSxFQUFFLHlCQUF5QjtZQUN2QyxVQUFVLEVBQUU7Z0JBQ1YsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO2dCQUN6QixXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7Z0JBQzlCLFdBQVcsRUFBRSxZQUFZLENBQUMsSUFBSTtnQkFDOUIsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTO2dCQUNqQyxVQUFVLFFBQUUsWUFBWSxDQUFDLFVBQVUsMENBQUUsUUFBUSxFQUFFO2dCQUMvQyxjQUFjLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQSxDQUFDLENBQUEsWUFBWSxDQUFDLGNBQWMs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dXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCB7IEFjY291bnRQcm92aWRlciB9IGZyb20gXCIuL2FjY291bnQtcHJvdmlkZXJcIjtcbmltcG9ydCAqIGFzIGNyIGZyb20gXCJAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzXCI7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSBcIkBhd3MtY2RrL2F3cy1zc21cIjsgXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuZXhwb3J0IGludGVyZmFjZSBJQWNjb3VudFByb3BzIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIGVtYWlsOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgdHlwZT86IEFjY291bnRUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgc3RhZ2VOYW1lPzogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIHN0YWdlT3JkZXI/OiBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIGhvc3RlZFNlcnZpY2VzPzogc3RyaW5nW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBwYXJlbnRPcmdhbml6YXRpb25hbFVuaXRJZD86IHN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBwYXJlbnRPcmdhbml6YXRpb25hbFVuaXROYW1lPzogc3RyaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIGlkPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZW51bSBBY2NvdW50VHlwZSB7XG4gIENJQ0QgPSBcIkNJQ0RcIixcbiAgRE5TID0gXCJETlNcIixcbiAgU1RBR0UgPSBcIlNUQUdFXCIsXG4gIFBMQVlHUk9VTkQgPSBcIlBMQVlHUk9VTkRcIlxufVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgY2xhc3MgQWNjb3VudCBleHRlbmRzIGNvcmUuQ29uc3RydWN0IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgcmVhZG9ubHkgYWNjb3VudE5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgYWNjb3VudElkOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGFjY291bnRTdGFnZU5hbWU/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNvcmUuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhY2NvdW50UHJvcHM6IElBY2NvdW50UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYWNjb3VudFByb3ZpZGVyID0gQWNjb3VudFByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMpO1xuXG4gICAgbGV0IGFjY291bnQgPSBuZXcgY29yZS5DdXN0b21SZXNvdXJjZShcbiAgICAgIHRoaXMsXG4gICAgICBgQWNjb3VudC0ke2FjY291bnRQcm9wcy5uYW1lfWAsXG4gICAgICB7XG4gICAgICAgIHNlcnZpY2VUb2tlbjogYWNjb3VudFByb3ZpZGVyLnByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgICAgcmVzb3VyY2VUeXBlOiBcIkN1c3RvbTo6QWNjb3VudENyZWF0aW9uXCIsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBFbWFpbDogYWNjb3VudFByb3BzLmVtYWlsLFxuICAgICAgICAgIEFjY291bnROYW1lOiBhY2NvdW50UHJvcHMubmFtZSxcbiAgICAgICAgICBBY2NvdW50VHlwZTogYWNjb3VudFByb3BzLnR5cGUsXG4gICAgICAgICAgU3RhZ2VOYW1lOiBhY2NvdW50UHJvcHMuc3RhZ2VOYW1lLFxuICAgICAgICAgIFN0YWdlT3JkZXI6IGFjY291bnRQcm9wcy5zdGFnZU9yZGVyPy50b1N0cmluZygpLFxuICAgICAgICAgIEhvc3RlZFNlcnZpY2VzOiBhY2NvdW50UHJvcHMuaG9zdGVkU2VydmljZXM/YWNjb3VudFByb3BzLmhvc3RlZFNlcnZpY2VzLmpvaW4oJzonKTp1bmRlZmluZWRcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbGV0IGFjY291bnRJZCA9IGFjY291bnQuZ2V0QXR0KFwiQWNjb3VudElkXCIpLnRvU3RyaW5nKCk7XG4gICAgXG4gICAgYWNjb3VudFByb3BzLmlkID0gYWNjb3VudElkO1xuICAgIHRoaXMuYWNjb3VudE5hbWUgPSBhY2NvdW50UHJvcHMubmFtZTtcbiAgICB0aGlzLmFjY291bnRJZCA9IGFjY291bnRJZDtcbiAgICB0aGlzLmFjY291bnRTdGFnZU5hbWUgPSBhY2NvdW50UHJvcHMuc3RhZ2VOYW1lO1xuXG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgYCR7YWNjb3VudFByb3BzLm5hbWV9LUFjY291bnREZXRhaWxzYCwge1xuICAgICAgZGVzY3JpcHRpb246IGBEZXRhaWxzIG9mICR7YWNjb3VudFByb3BzLm5hbWV9YCxcbiAgICAgIHBhcmFtZXRlck5hbWU6IGAvYWNjb3VudHMvJHthY2NvdW50UHJvcHMubmFtZX1gLFxuICAgICAgc3RyaW5nVmFsdWU6IEpTT04uc3RyaW5naWZ5KGFjY291bnRQcm9wcyksXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKGFjY291bnRQcm9wcy5wYXJlbnRPcmdhbml6YXRpb25hbFVuaXRJZCkge1xuICAgICAgbGV0IHBhcmVudCA9IG5ldyBjci5Bd3NDdXN0b21SZXNvdXJjZSh0aGlzLCBcIkxpc3RQYXJlbnRzQ3VzdG9tUmVzb3VyY2VcIiwge1xuICAgICAgICBvbkNyZWF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6IFwiT3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgIGFjdGlvbjogXCJsaXN0UGFyZW50c1wiLFxuICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZShcbiAgICAgICAgICAgIFwiUGFyZW50cy4wLklkXCJcbiAgICAgICAgICApLFxuICAgICAgICAgIHJlZ2lvbjogXCJ1cy1lYXN0LTFcIiwgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgQ2hpbGRJZDogYWNjb3VudElkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uVXBkYXRlOiB7XG4gICAgICAgICAgc2VydmljZTogXCJPcmdhbml6YXRpb25zXCIsXG4gICAgICAgICAgYWN0aW9uOiBcImxpc3RQYXJlbnRzXCIsXG4gICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBjci5QaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlKFxuICAgICAgICAgICAgXCJQYXJlbnRzLjAuSWRcIlxuICAgICAgICAgICksXG4gICAgICAgICAgcmVnaW9uOiBcInVzLWVhc3QtMVwiLCAvL0FXUyBPcmdhbml6YXRpb25zIEFQSSBhcmUgb25seSBhdmFpbGFibGUgaW4gdXMtZWFzdC0xIGZvciByb290IGFjdGlvbnNcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBDaGlsZElkOiBhY2NvdW50SWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb25EZWxldGU6IHtcbiAgICAgICAgICBzZXJ2aWNlOiBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICBhY3Rpb246IFwibGlzdFBhcmVudHNcIixcbiAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoXG4gICAgICAgICAgICBcIlBhcmVudHMuMC5JZFwiXG4gICAgICAgICAgKSxcbiAgICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIENoaWxkSWQ6IGFjY291bnRJZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBwb2xpY3k6IGNyLkF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBjci5Bd3NDdXN0b21SZXNvdXJjZShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgXCJNb3ZlQWNjb3VudEN1c3RvbVJlc291cmNlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICBvbkNyZWF0ZToge1xuICAgICAgICAgICAgc2VydmljZTogXCJPcmdhbml6YXRpb25zXCIsXG4gICAgICAgICAgICBhY3Rpb246IFwibW92ZUFjY291bnRcIixcbiAgICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLm9mKGFjY291bnRJZCksXG4gICAgICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBBY2NvdW50SWQ6IGFjY291bnRJZCxcbiAgICAgICAgICAgICAgRGVzdGluYXRpb25QYXJlbnRJZDogYWNjb3VudFByb3BzLnBhcmVudE9yZ2FuaXphdGlvbmFsVW5pdElkLFxuICAgICAgICAgICAgICBTb3VyY2VQYXJlbnRJZDogcGFyZW50LmdldFJlc3BvbnNlRmllbGQoXCJQYXJlbnRzLjAuSWRcIiksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoe1xuICAgICAgICAgICAgcmVzb3VyY2VzOiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UsXG4gICAgICAgICAgfSksXG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIC8vIEVuYWJsaW5nIE9yZ2FuaXphdGlvbnMgbGlzdEFjY291bnRzIGNhbGwgZm9yIGF1dG8gcmVzb2x1dGlvbiBvZiBzdGFnZXMgYW5kIEROUyBhY2NvdW50cyBJZHMgYW5kIE5hbWVzXG4gICAgICBpZiAoYWNjb3VudFByb3BzLnR5cGUgPT09IEFjY291bnRUeXBlLkNJQ0QpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckFzRGVsZWdhdGVkQWRtaW5pc3RyYXRvcihhY2NvdW50SWQsICdzc20uYW1hem9uYXdzLmNvbScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAvLyBTd2l0Y2hpbmcgdG8gYW5vdGhlciBwcmluY2lwYWwgdG8gd29ya2Fyb3VuZCB0aGUgbWF4IG51bWJlciBvZiBkZWxlZ2F0ZWQgYWRtaW5pc3RyYXRvcnMgKHdoaWNoIGlzIHNldCB0byAzIGJ5IGRlZmF1bHQpLlxuICAgICAgICB0aGlzLnJlZ2lzdGVyQXNEZWxlZ2F0ZWRBZG1pbmlzdHJhdG9yKGFjY291bnRJZCwgJ2NvbmZpZy1tdWx0aWFjY291bnRzZXR1cC5hbWF6b25hd3MuY29tJyk7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICByZWdpc3RlckFzRGVsZWdhdGVkQWRtaW5pc3RyYXRvcihhY2NvdW50SWQ6IHN0cmluZywgc2VydmljZVByaW5jaXBhbDogc3RyaW5nKSB7XG4gICAgbmV3IGNyLkF3c0N1c3RvbVJlc291cmNlKHRoaXMsIFxuICAgICAgXCJyZWdpc3RlckRlbGVnYXRlZEFkbWluaXN0cmF0b3JcIiwgXG4gICAgICB7XG4gICAgICAgIG9uQ3JlYXRlOiB7XG4gICAgICAgICAgc2VydmljZTogJ09yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIGFjdGlvbjogJ3JlZ2lzdGVyRGVsZWdhdGVkQWRtaW5pc3RyYXRvcicsIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9BV1MvT3JnYW5pemF0aW9ucy5odG1sI3JlZ2lzdGVyRGVsZWdhdGVkQWRtaW5pc3RyYXRvci1wcm9wZXJ0eVxuICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdyZWdpc3RlckRlbGVnYXRlZEFkbWluaXN0cmF0b3InKSxcbiAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLCAvL0FXUyBPcmdhbml6YXRpb25zIEFQSSBhcmUgb25seSBhdmFpbGFibGUgaW4gdXMtZWFzdC0xIGZvciByb290IGFjdGlvbnNcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBBY2NvdW50SWQ6IGFjY291bnRJZCxcbiAgICAgICAgICAgIFNlcnZpY2VQcmluY2lwYWw6IHNlcnZpY2VQcmluY2lwYWxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uRGVsZXRlOiB7XG4gICAgICAgICAgc2VydmljZTogJ09yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIGFjdGlvbjogJ2RlcmVnaXN0ZXJEZWxlZ2F0ZWRBZG1pbmlzdHJhdG9yJywgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9Pcmdhbml6YXRpb25zLmh0bWwjZGVyZWdpc3RlckRlbGVnYXRlZEFkbWluaXN0cmF0b3ItcHJvcGVydHlcbiAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5vZigncmVnaXN0ZXJEZWxlZ2F0ZWRBZG1pbmlzdHJhdG9yJyksXG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJywgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgQWNjb3VudElkOiBhY2NvdW50SWQsXG4gICAgICAgICAgICBTZXJ2aWNlUHJpbmNpcGFsOiBzZXJ2aWNlUHJpbmNpcGFsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoXG4gICAgICAgICAge1xuICAgICAgICAgICAgcmVzb3VyY2VzOiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0VcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=