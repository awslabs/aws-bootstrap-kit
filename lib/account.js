"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.AccountType = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        var _b;
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
                StageOrder: (_b = accountProps.stageOrder) === null || _b === void 0 ? void 0 : _b.toString(),
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
_a = JSII_RTTI_SYMBOL_1;
Account[_a] = { fqn: "aws-bootstrap-kit.Account", version: "0.3.9" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTtBQUVGLHNDQUFzQztBQUN0Qyx5REFBcUQ7QUFDckQsZ0RBQWdEO0FBQ2hELHdDQUF3QztBQTZDeEMsSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3JCLDRCQUFhLENBQUE7SUFDYiwwQkFBVyxDQUFBO0lBQ1gsOEJBQWUsQ0FBQTtJQUNmLHdDQUF5QixDQUFBO0FBQzNCLENBQUMsRUFMVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUt0Qjs7OztBQUtELE1BQWEsT0FBUSxTQUFRLElBQUksQ0FBQyxTQUFTO0lBWXpDLFlBQVksS0FBcUIsRUFBRSxFQUFVLEVBQUUsWUFBMkI7O1FBQ3hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxlQUFlLEdBQUcsa0NBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUNuQyxJQUFJLEVBQ0osV0FBVyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQzlCO1lBQ0UsWUFBWSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsWUFBWTtZQUNuRCxZQUFZLEVBQUUseUJBQXlCO1lBQ3ZDLFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUs7Z0JBQ3pCLFdBQVcsRUFBRSxZQUFZLENBQUMsSUFBSTtnQkFDOUIsV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJO2dCQUM5QixTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVM7Z0JBQ2pDLFVBQVUsUUFBRSxZQUFZLENBQUMsVUFBVSwwQ0FBRSxRQUFRLEVBQUU7Z0JBQy9DLGNBQWMsRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFBLENBQUMsQ0FBQSxZQUFZLENBQUMsY0FB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Y2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIFxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBBY2NvdW50UHJvdmlkZXIgfSBmcm9tIFwiLi9hY2NvdW50LXByb3ZpZGVyXCI7XG5pbXBvcnQgKiBhcyBjciBmcm9tIFwiQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlc1wiO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gXCJAYXdzLWNkay9hd3Mtc3NtXCI7IFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbmV4cG9ydCBpbnRlcmZhY2UgSUFjY291bnRQcm9wcyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBlbWFpbDogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIHR5cGU/OiBBY2NvdW50VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIHN0YWdlTmFtZT86IHN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBzdGFnZU9yZGVyPzogbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBob3N0ZWRTZXJ2aWNlcz86IHN0cmluZ1tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgcGFyZW50T3JnYW5pemF0aW9uYWxVbml0SWQ/OiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgcGFyZW50T3JnYW5pemF0aW9uYWxVbml0TmFtZT86IHN0cmluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBpZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gQWNjb3VudFR5cGUge1xuICBDSUNEID0gXCJDSUNEXCIsXG4gIEROUyA9IFwiRE5TXCIsXG4gIFNUQUdFID0gXCJTVEFHRVwiLFxuICBQTEFZR1JPVU5EID0gXCJQTEFZR1JPVU5EXCJcbn1cblxuICAgICAgICAgICAgICAgICAgICAgICAgIFxuZXhwb3J0IGNsYXNzIEFjY291bnQgZXh0ZW5kcyBjb3JlLkNvbnN0cnVjdCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIHJlYWRvbmx5IGFjY291bnROYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGFjY291bnRJZDogc3RyaW5nO1xuICByZWFkb25seSBhY2NvdW50U3RhZ2VOYW1lPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb3JlLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgYWNjb3VudFByb3BzOiBJQWNjb3VudFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGFjY291bnRQcm92aWRlciA9IEFjY291bnRQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzKTtcblxuICAgIGxldCBhY2NvdW50ID0gbmV3IGNvcmUuQ3VzdG9tUmVzb3VyY2UoXG4gICAgICB0aGlzLFxuICAgICAgYEFjY291bnQtJHthY2NvdW50UHJvcHMubmFtZX1gLFxuICAgICAge1xuICAgICAgICBzZXJ2aWNlVG9rZW46IGFjY291bnRQcm92aWRlci5wcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICAgIHJlc291cmNlVHlwZTogXCJDdXN0b206OkFjY291bnRDcmVhdGlvblwiLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgRW1haWw6IGFjY291bnRQcm9wcy5lbWFpbCxcbiAgICAgICAgICBBY2NvdW50TmFtZTogYWNjb3VudFByb3BzLm5hbWUsXG4gICAgICAgICAgQWNjb3VudFR5cGU6IGFjY291bnRQcm9wcy50eXBlLFxuICAgICAgICAgIFN0YWdlTmFtZTogYWNjb3VudFByb3BzLnN0YWdlTmFtZSxcbiAgICAgICAgICBTdGFnZU9yZGVyOiBhY2NvdW50UHJvcHMuc3RhZ2VPcmRlcj8udG9TdHJpbmcoKSxcbiAgICAgICAgICBIb3N0ZWRTZXJ2aWNlczogYWNjb3VudFByb3BzLmhvc3RlZFNlcnZpY2VzP2FjY291bnRQcm9wcy5ob3N0ZWRTZXJ2aWNlcy5qb2luKCc6Jyk6dW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGxldCBhY2NvdW50SWQgPSBhY2NvdW50LmdldEF0dChcIkFjY291bnRJZFwiKS50b1N0cmluZygpO1xuICAgIFxuICAgIGFjY291bnRQcm9wcy5pZCA9IGFjY291bnRJZDtcbiAgICB0aGlzLmFjY291bnROYW1lID0gYWNjb3VudFByb3BzLm5hbWU7XG4gICAgdGhpcy5hY2NvdW50SWQgPSBhY2NvdW50SWQ7XG4gICAgdGhpcy5hY2NvdW50U3RhZ2VOYW1lID0gYWNjb3VudFByb3BzLnN0YWdlTmFtZTtcblxuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsIGAke2FjY291bnRQcm9wcy5uYW1lfS1BY2NvdW50RGV0YWlsc2AsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgRGV0YWlscyBvZiAke2FjY291bnRQcm9wcy5uYW1lfWAsXG4gICAgICBwYXJhbWV0ZXJOYW1lOiBgL2FjY291bnRzLyR7YWNjb3VudFByb3BzLm5hbWV9YCxcbiAgICAgIHN0cmluZ1ZhbHVlOiBKU09OLnN0cmluZ2lmeShhY2NvdW50UHJvcHMpLFxuICAgIH0pO1xuICAgIFxuICAgIGlmIChhY2NvdW50UHJvcHMucGFyZW50T3JnYW5pemF0aW9uYWxVbml0SWQpIHtcbiAgICAgIGxldCBwYXJlbnQgPSBuZXcgY3IuQXdzQ3VzdG9tUmVzb3VyY2UodGhpcywgXCJMaXN0UGFyZW50c0N1c3RvbVJlc291cmNlXCIsIHtcbiAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICBzZXJ2aWNlOiBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICBhY3Rpb246IFwibGlzdFBhcmVudHNcIixcbiAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoXG4gICAgICAgICAgICBcIlBhcmVudHMuMC5JZFwiXG4gICAgICAgICAgKSxcbiAgICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIENoaWxkSWQ6IGFjY291bnRJZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvblVwZGF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6IFwiT3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgIGFjdGlvbjogXCJsaXN0UGFyZW50c1wiLFxuICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZShcbiAgICAgICAgICAgIFwiUGFyZW50cy4wLklkXCJcbiAgICAgICAgICApLFxuICAgICAgICAgIHJlZ2lvbjogXCJ1cy1lYXN0LTFcIiwgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgQ2hpbGRJZDogYWNjb3VudElkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uRGVsZXRlOiB7XG4gICAgICAgICAgc2VydmljZTogXCJPcmdhbml6YXRpb25zXCIsXG4gICAgICAgICAgYWN0aW9uOiBcImxpc3RQYXJlbnRzXCIsXG4gICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBjci5QaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlKFxuICAgICAgICAgICAgXCJQYXJlbnRzLjAuSWRcIlxuICAgICAgICAgICksXG4gICAgICAgICAgcmVnaW9uOiBcInVzLWVhc3QtMVwiLCAvL0FXUyBPcmdhbml6YXRpb25zIEFQSSBhcmUgb25seSBhdmFpbGFibGUgaW4gdXMtZWFzdC0xIGZvciByb290IGFjdGlvbnNcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBDaGlsZElkOiBhY2NvdW50SWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoe1xuICAgICAgICAgIHJlc291cmNlczogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgY3IuQXdzQ3VzdG9tUmVzb3VyY2UoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIFwiTW92ZUFjY291bnRDdXN0b21SZXNvdXJjZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICAgIHNlcnZpY2U6IFwiT3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgICAgYWN0aW9uOiBcIm1vdmVBY2NvdW50XCIsXG4gICAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5vZihhY2NvdW50SWQpLFxuICAgICAgICAgICAgcmVnaW9uOiBcInVzLWVhc3QtMVwiLCAvL0FXUyBPcmdhbml6YXRpb25zIEFQSSBhcmUgb25seSBhdmFpbGFibGUgaW4gdXMtZWFzdC0xIGZvciByb290IGFjdGlvbnNcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgQWNjb3VudElkOiBhY2NvdW50SWQsXG4gICAgICAgICAgICAgIERlc3RpbmF0aW9uUGFyZW50SWQ6IGFjY291bnRQcm9wcy5wYXJlbnRPcmdhbml6YXRpb25hbFVuaXRJZCxcbiAgICAgICAgICAgICAgU291cmNlUGFyZW50SWQ6IHBhcmVudC5nZXRSZXNwb25zZUZpZWxkKFwiUGFyZW50cy4wLklkXCIpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvbGljeTogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgICAgICAgIHJlc291cmNlczogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9XG4gICAgICApO1xuXG4gICAgICAvLyBFbmFibGluZyBPcmdhbml6YXRpb25zIGxpc3RBY2NvdW50cyBjYWxsIGZvciBhdXRvIHJlc29sdXRpb24gb2Ygc3RhZ2VzIGFuZCBETlMgYWNjb3VudHMgSWRzIGFuZCBOYW1lc1xuICAgICAgaWYgKGFjY291bnRQcm9wcy50eXBlID09PSBBY2NvdW50VHlwZS5DSUNEKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJBc0RlbGVnYXRlZEFkbWluaXN0cmF0b3IoYWNjb3VudElkLCAnc3NtLmFtYXpvbmF3cy5jb20nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgLy8gU3dpdGNoaW5nIHRvIGFub3RoZXIgcHJpbmNpcGFsIHRvIHdvcmthcm91bmQgdGhlIG1heCBudW1iZXIgb2YgZGVsZWdhdGVkIGFkbWluaXN0cmF0b3JzICh3aGljaCBpcyBzZXQgdG8gMyBieSBkZWZhdWx0KS5cbiAgICAgICAgdGhpcy5yZWdpc3RlckFzRGVsZWdhdGVkQWRtaW5pc3RyYXRvcihhY2NvdW50SWQsICdjb25maWctbXVsdGlhY2NvdW50c2V0dXAuYW1hem9uYXdzLmNvbScpO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJBc0RlbGVnYXRlZEFkbWluaXN0cmF0b3IoYWNjb3VudElkOiBzdHJpbmcsIHNlcnZpY2VQcmluY2lwYWw6IHN0cmluZykge1xuICAgIG5ldyBjci5Bd3NDdXN0b21SZXNvdXJjZSh0aGlzLCBcbiAgICAgIFwicmVnaXN0ZXJEZWxlZ2F0ZWRBZG1pbmlzdHJhdG9yXCIsIFxuICAgICAge1xuICAgICAgICBvbkNyZWF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICBhY3Rpb246ICdyZWdpc3RlckRlbGVnYXRlZEFkbWluaXN0cmF0b3InLCAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTSmF2YVNjcmlwdFNESy9sYXRlc3QvQVdTL09yZ2FuaXphdGlvbnMuaHRtbCNyZWdpc3RlckRlbGVnYXRlZEFkbWluaXN0cmF0b3ItcHJvcGVydHlcbiAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5vZigncmVnaXN0ZXJEZWxlZ2F0ZWRBZG1pbmlzdHJhdG9yJyksXG4gICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJywgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgQWNjb3VudElkOiBhY2NvdW50SWQsXG4gICAgICAgICAgICBTZXJ2aWNlUHJpbmNpcGFsOiBzZXJ2aWNlUHJpbmNpcGFsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkRlbGV0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICBhY3Rpb246ICdkZXJlZ2lzdGVyRGVsZWdhdGVkQWRtaW5pc3RyYXRvcicsIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9BV1MvT3JnYW5pemF0aW9ucy5odG1sI2RlcmVnaXN0ZXJEZWxlZ2F0ZWRBZG1pbmlzdHJhdG9yLXByb3BlcnR5XG4gICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBjci5QaHlzaWNhbFJlc291cmNlSWQub2YoJ3JlZ2lzdGVyRGVsZWdhdGVkQWRtaW5pc3RyYXRvcicpLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIEFjY291bnRJZDogYWNjb3VudElkLFxuICAgICAgICAgICAgU2VydmljZVByaW5jaXBhbDogc2VydmljZVByaW5jaXBhbFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgICAgIHBvbGljeTogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJlc291cmNlczogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuIl19