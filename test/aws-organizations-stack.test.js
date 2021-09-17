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
require("@aws-cdk/assert/jest");
const lib_1 = require("../lib");
const core_1 = require("@aws-cdk/core");
const package_json_1 = require("../package.json");
const awsOrganizationsStackProps = {
    email: "test@test.com",
    nestedOU: [
        {
            name: "SDLC",
            accounts: [
                {
                    name: "Account1",
                    stageName: 'theStage',
                },
                {
                    name: "Account2"
                }
            ]
        },
        {
            name: "Prod",
            accounts: [
                {
                    name: "Account3"
                }
            ]
        }
    ]
};
test("when I define 1 OU with 2 accounts and 1 OU with 1 account then the stack should have 2 OU constructs and 3 account constructs", () => {
    const stack = new core_1.Stack();
    let awsOrganizationsStackProps;
    awsOrganizationsStackProps = {
        email: "test@test.com",
        nestedOU: [
            {
                name: 'SDLC',
                accounts: [
                    {
                        name: 'Account1',
                        type: lib_1.AccountType.PLAYGROUND,
                        hostedServices: ['app1', 'app2']
                    },
                    {
                        name: 'Account2',
                        type: lib_1.AccountType.STAGE,
                        stageOrder: 1,
                        stageName: 'stage1',
                        hostedServices: ['app1', 'app2']
                    }
                ]
            },
            {
                name: 'Prod',
                accounts: [
                    {
                        name: 'Account3',
                        type: lib_1.AccountType.STAGE,
                        stageOrder: 2,
                        stageName: 'stage2',
                        hostedServices: ['app1', 'app2']
                    }
                ]
            }
        ]
    };
    const awsOrganizationsStack = new lib_1.AwsOrganizationsStack(stack, "AWSOrganizationsStack", awsOrganizationsStackProps);
    expect(awsOrganizationsStack.templateOptions.description).toMatch(`(version:${package_json_1.version})`);
    expect(awsOrganizationsStack).toHaveResource("Custom::AWS", {
        "Create": {
            "service": "Organizations",
            "action": "createOrganization",
            "physicalResourceId": {
                "responsePath": "Organization.Id"
            },
            "region": "us-east-1"
        },
        "Delete": {
            "service": "Organizations",
            "action": "deleteOrganization",
            "region": "us-east-1"
        }
    });
    expect(awsOrganizationsStack).toHaveResource("Custom::AWS", {
        "Create": {
            "service": "Organizations",
            "action": "createOrganizationalUnit",
            "physicalResourceId": {
                "responsePath": "OrganizationalUnit.Id"
            },
            "region": "us-east-1",
            "parameters": {
                "Name": "SDLC",
                "ParentId": {
                    "Fn::GetAtt": [
                        "OrganizationRootCustomResource9416950B",
                        "Roots.0.Id"
                    ]
                }
            }
        }
    });
    expect(awsOrganizationsStack).toHaveResource("Custom::AccountCreation", {
        "Email": {
            "Fn::Join": [
                "",
                [
                    "test+Account1-",
                    {
                        "Ref": "AWS::AccountId"
                    },
                    "@test.com"
                ]
            ]
        },
        "AccountName": "Account1",
        "AccountType": lib_1.AccountType.PLAYGROUND,
        "HostedServices": "app1:app2"
    });
    expect(awsOrganizationsStack).toHaveResource("Custom::AccountCreation", {
        "Email": {
            "Fn::Join": [
                "",
                [
                    "test+Account2-",
                    {
                        "Ref": "AWS::AccountId"
                    },
                    "@test.com"
                ]
            ]
        },
        "AccountName": "Account2",
        "AccountType": lib_1.AccountType.STAGE,
        "StageName": "stage1",
        "StageOrder": "1",
        "HostedServices": "app1:app2"
    });
    expect(awsOrganizationsStack).toHaveResource("Custom::AWS", {
        "Create": {
            "service": "Organizations",
            "action": "createOrganizationalUnit",
            "physicalResourceId": {
                "responsePath": "OrganizationalUnit.Id"
            },
            "region": "us-east-1",
            "parameters": {
                "Name": "Prod",
                "ParentId": {
                    "Fn::GetAtt": [
                        "OrganizationRootCustomResource9416950B",
                        "Roots.0.Id"
                    ]
                }
            }
        }
    });
    expect(awsOrganizationsStack).toHaveResource("Custom::AccountCreation", {
        "Email": {
            "Fn::Join": [
                "",
                [
                    "test+Account3-",
                    {
                        "Ref": "AWS::AccountId"
                    },
                    "@test.com"
                ]
            ]
        },
        "AccountName": "Account3",
        "AccountType": lib_1.AccountType.STAGE,
        "StageName": "stage2",
        "StageOrder": "2",
        "HostedServices": "app1:app2"
    });
});
test("should create root domain zone and stage based domain if rootHostedZoneDNSName is specified ", () => {
    const awsOrganizationsStack = new lib_1.AwsOrganizationsStack(new core_1.Stack(), "AWSOrganizationsStack", {
        ...awsOrganizationsStackProps,
        rootHostedZoneDNSName: "yourdomain.com"
    });
    expect(awsOrganizationsStack).toHaveResource("AWS::Route53::HostedZone", {
        Name: "yourdomain.com."
    });
    expect(awsOrganizationsStack).toCountResources("AWS::Route53::RecordSet", 3);
    expect(awsOrganizationsStack).toCountResources("AWS::Route53::HostedZone", 4);
    expect(awsOrganizationsStack).toHaveResource("AWS::Route53::RecordSet", {
        Name: "thestage.yourdomain.com.",
        Type: "NS"
    });
    expect(awsOrganizationsStack).toHaveResource("AWS::Route53::RecordSet", {
        Name: "account2.yourdomain.com.",
        Type: "NS"
    });
    expect(awsOrganizationsStack).toHaveResource("AWS::Route53::RecordSet", {
        Name: "account3.yourdomain.com.",
        Type: "NS"
    });
    expect(awsOrganizationsStack).toHaveResource("AWS::Route53::HostedZone", {
        Name: "account3.yourdomain.com."
    });
    expect(awsOrganizationsStack).toHaveResource("AWS::IAM::Role", {
        RoleName: "account2.yourdomain.com-dns-update"
    });
});
test("should not create any zone if no domain is provided", () => {
    const awsOrganizationsStack = new lib_1.AwsOrganizationsStack(new core_1.Stack(), "AWSOrganizationsStack", {
        ...awsOrganizationsStackProps,
    });
    expect(awsOrganizationsStack).toCountResources("AWS::Route53::HostedZone", 0);
});
test("should have have email validation stack with forceEmailVerification set to true", () => {
    const awsOrganizationsStack = new lib_1.AwsOrganizationsStack(new core_1.Stack(), "AWSOrganizationsStack", { ...awsOrganizationsStackProps, forceEmailVerification: true });
    expect(awsOrganizationsStack).toHaveResource("Custom::EmailValidation");
});
test("should not have have email validation stack with forceEmailVerification set to false", () => {
    const awsOrganizationsStack = new lib_1.AwsOrganizationsStack(new core_1.Stack(), "AWSOrganizationsStack", { ...awsOrganizationsStackProps, forceEmailVerification: false });
    expect(awsOrganizationsStack).not.toHaveResource("Custom::EmailValidation");
});
test("should have have email validation stack by default without setting forceEmailVerification", () => {
    const awsOrganizationsStack = new lib_1.AwsOrganizationsStack(new core_1.Stack(), "AWSOrganizationsStack", awsOrganizationsStackProps);
    expect(awsOrganizationsStack).toHaveResource("Custom::EmailValidation");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLW9yZ2FuaXphdGlvbnMtc3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1vcmdhbml6YXRpb25zLXN0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGLGdDQUE4QjtBQUM5QixnQ0FBd0Y7QUFDeEYsd0NBQXNDO0FBQ3RDLGtEQUF3QztBQUV4QyxNQUFNLDBCQUEwQixHQUErQjtJQUM3RCxLQUFLLEVBQUUsZUFBZTtJQUN0QixRQUFRLEVBQUU7UUFDUjtZQUNFLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFO2dCQUNSO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixTQUFTLEVBQUUsVUFBVTtpQkFDdEI7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7aUJBQ2pCO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7aUJBQ2pCO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQztBQUVGLElBQUksQ0FBQyxnSUFBZ0ksRUFBRSxHQUFHLEVBQUU7SUFFeEksTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixJQUFJLDBCQUFzRCxDQUFDO0lBQzNELDBCQUEwQixHQUFHO1FBQ3pCLEtBQUssRUFBRSxlQUFlO1FBQ3RCLFFBQVEsRUFBRTtZQUNOO2dCQUNJLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRTtvQkFDTjt3QkFDSSxJQUFJLEVBQUUsVUFBVTt3QkFDaEIsSUFBSSxFQUFFLGlCQUFXLENBQUMsVUFBVTt3QkFDNUIsY0FBYyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztxQkFDbkM7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLElBQUksRUFBRSxpQkFBVyxDQUFDLEtBQUs7d0JBQ3ZCLFVBQVUsRUFBRSxD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MEJBQTBCLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLENBQzlELENBQUM7SUFFRixNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMxRSxDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxzRkFBc0YsRUFBRSxHQUFHLEVBQUU7SUFFaEcsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLDJCQUFxQixDQUNyRCxJQUFJLFlBQUssRUFBRSxFQUNYLHVCQUF1QixFQUN2QixFQUFDLEdBQUcsMEJBQTBCLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxFQUFDLENBQy9ELENBQUM7SUFFRixNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDOUUsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsMkZBQTJGLEVBQUUsR0FBRyxFQUFFO0lBQ3JHLE1BQU0scUJBQXFCLEdBQUcsSUFBSSwyQkFBcUIsQ0FDckQsSUFBSSxZQUFLLEVBQUUsRUFDWCx1QkFBdUIsRUFDdkIsMEJBQTBCLENBQzNCLENBQUM7SUFFRixNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMxRSxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgXCJAYXdzLWNkay9hc3NlcnQvamVzdFwiO1xuaW1wb3J0IHsgQWNjb3VudFR5cGUsIEF3c09yZ2FuaXphdGlvbnNTdGFjaywgQXdzT3JnYW5pemF0aW9uc1N0YWNrUHJvcHMgfSBmcm9tIFwiLi4vbGliXCI7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQge3ZlcnNpb259IGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5cbmNvbnN0IGF3c09yZ2FuaXphdGlvbnNTdGFja1Byb3BzOiBBd3NPcmdhbml6YXRpb25zU3RhY2tQcm9wcyA9IHtcbiAgZW1haWw6IFwidGVzdEB0ZXN0LmNvbVwiLFxuICBuZXN0ZWRPVTogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiU0RMQ1wiLFxuICAgICAgYWNjb3VudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQWNjb3VudDFcIixcbiAgICAgICAgICBzdGFnZU5hbWU6ICd0aGVTdGFnZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIkFjY291bnQyXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogXCJQcm9kXCIsXG4gICAgICBhY2NvdW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJBY2NvdW50M1wiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG5cbnRlc3QoXCJ3aGVuIEkgZGVmaW5lIDEgT1Ugd2l0aCAyIGFjY291bnRzIGFuZCAxIE9VIHdpdGggMSBhY2NvdW50IHRoZW4gdGhlIHN0YWNrIHNob3VsZCBoYXZlIDIgT1UgY29uc3RydWN0cyBhbmQgMyBhY2NvdW50IGNvbnN0cnVjdHNcIiwgKCkgPT4ge1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBsZXQgYXdzT3JnYW5pemF0aW9uc1N0YWNrUHJvcHM6IEF3c09yZ2FuaXphdGlvbnNTdGFja1Byb3BzO1xuICAgIGF3c09yZ2FuaXphdGlvbnNTdGFja1Byb3BzID0ge1xuICAgICAgICBlbWFpbDogXCJ0ZXN0QHRlc3QuY29tXCIsXG4gICAgICAgIG5lc3RlZE9VOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1NETEMnLFxuICAgICAgICAgICAgICAgIGFjY291bnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdBY2NvdW50MScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBY2NvdW50VHlwZS5QTEFZR1JPVU5ELFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9zdGVkU2VydmljZXM6IFsnYXBwMScsICdhcHAyJ11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjY291bnQyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFjY291bnRUeXBlLlNUQUdFLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2VPcmRlcjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlTmFtZTogJ3N0YWdlMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBob3N0ZWRTZXJ2aWNlczogWydhcHAxJywgJ2FwcDInXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUHJvZCcsXG4gICAgICAgICAgICAgICAgYWNjb3VudHM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0FjY291bnQzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFjY291bnRUeXBlLlNUQUdFLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2VPcmRlcjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlTmFtZTogJ3N0YWdlMicsXG4gICAgICAgICAgICAgICAgICAgICAgICBob3N0ZWRTZXJ2aWNlczogWydhcHAxJywgJ2FwcDInXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfTtcblxuXG4gICAgY29uc3QgYXdzT3JnYW5pemF0aW9uc1N0YWNrID0gbmV3IEF3c09yZ2FuaXphdGlvbnNTdGFjayhzdGFjaywgXCJBV1NPcmdhbml6YXRpb25zU3RhY2tcIiwgYXdzT3JnYW5pemF0aW9uc1N0YWNrUHJvcHMpO1xuXG4gICAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjay50ZW1wbGF0ZU9wdGlvbnMuZGVzY3JpcHRpb24pLnRvTWF0Y2goYCh2ZXJzaW9uOiR7dmVyc2lvbn0pYCk7XG5cbiAgICBleHBlY3QoYXdzT3JnYW5pemF0aW9uc1N0YWNrKS50b0hhdmVSZXNvdXJjZShcIkN1c3RvbTo6QVdTXCIsIHtcbiAgICAgICAgXCJDcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiT3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJjcmVhdGVPcmdhbml6YXRpb25cIixcbiAgICAgICAgICAgIFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6IHtcbiAgICAgICAgICAgICAgXCJyZXNwb25zZVBhdGhcIjogXCJPcmdhbml6YXRpb24uSWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVnaW9uXCI6IFwidXMtZWFzdC0xXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiRGVsZXRlXCI6IHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZGVsZXRlT3JnYW5pemF0aW9uXCIsXG4gICAgICAgICAgICBcInJlZ2lvblwiOiBcInVzLWVhc3QtMVwiXG4gICAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJDdXN0b206OkFXU1wiLCB7XG4gICAgICAgIFwiQ3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiY3JlYXRlT3JnYW5pemF0aW9uYWxVbml0XCIsXG4gICAgICAgICAgICBcInBoeXNpY2FsUmVzb3VyY2VJZFwiOiB7XG4gICAgICAgICAgICAgIFwicmVzcG9uc2VQYXRoXCI6IFwiT3JnYW5pemF0aW9uYWxVbml0LklkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlZ2lvblwiOiBcInVzLWVhc3QtMVwiLFxuICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IHtcbiAgICAgICAgICAgICAgXCJOYW1lXCI6IFwiU0RMQ1wiLFxuICAgICAgICAgICAgICBcIlBhcmVudElkXCI6IHtcbiAgICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgICAgXCJPcmdhbml6YXRpb25Sb290Q3VzdG9tUmVzb3VyY2U5NDE2OTUwQlwiLFxuICAgICAgICAgICAgICAgICAgXCJSb290cy4wLklkXCJcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXdzT3JnYW5pemF0aW9uc1N0YWNrKS50b0hhdmVSZXNvdXJjZShcIkN1c3RvbTo6QWNjb3VudENyZWF0aW9uXCIsIHtcbiAgICAgICAgXCJFbWFpbFwiOiB7XG4gICAgICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBcInRlc3QrQWNjb3VudDEtXCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIlJlZlwiOiBcIkFXUzo6QWNjb3VudElkXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJAdGVzdC5jb21cIlxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgXCJBY2NvdW50TmFtZVwiOiBcIkFjY291bnQxXCIsXG4gICAgICAgIFwiQWNjb3VudFR5cGVcIjogQWNjb3VudFR5cGUuUExBWUdST1VORCxcbiAgICAgICAgXCJIb3N0ZWRTZXJ2aWNlc1wiOiBcImFwcDE6YXBwMlwiXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXdzT3JnYW5pemF0aW9uc1N0YWNrKS50b0hhdmVSZXNvdXJjZShcIkN1c3RvbTo6QWNjb3VudENyZWF0aW9uXCIsIHtcbiAgICAgICAgXCJFbWFpbFwiOiB7XG4gICAgICAgICAgICBcIkZuOjpKb2luXCI6IFtcbiAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFwidGVzdCtBY2NvdW50Mi1cIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIlJlZlwiOiBcIkFXUzo6QWNjb3VudElkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQHRlc3QuY29tXCJcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJBY2NvdW50TmFtZVwiOiBcIkFjY291bnQyXCIsXG4gICAgICAgICAgXCJBY2NvdW50VHlwZVwiOiBBY2NvdW50VHlwZS5TVEFHRSxcbiAgICAgICAgICBcIlN0YWdlTmFtZVwiOiBcInN0YWdlMVwiLFxuICAgICAgICAgIFwiU3RhZ2VPcmRlclwiOiBcIjFcIixcbiAgICAgICAgICBcIkhvc3RlZFNlcnZpY2VzXCI6IFwiYXBwMTphcHAyXCJcbiAgICB9KTtcblxuICAgIGV4cGVjdChhd3NPcmdhbml6YXRpb25zU3RhY2spLnRvSGF2ZVJlc291cmNlKFwiQ3VzdG9tOjpBV1NcIiwge1xuICAgICAgICBcIkNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcInNlcnZpY2VcIjogXCJPcmdhbml6YXRpb25zXCIsXG4gICAgICAgICAgICBcImFjdGlvblwiOiBcImNyZWF0ZU9yZ2FuaXphdGlvbmFsVW5pdFwiLFxuICAgICAgICAgICAgXCJwaHlzaWNhbFJlc291cmNlSWRcIjoge1xuICAgICAgICAgICAgICBcInJlc3BvbnNlUGF0aFwiOiBcIk9yZ2FuaXphdGlvbmFsVW5pdC5JZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZWdpb25cIjogXCJ1cy1lYXN0LTFcIixcbiAgICAgICAgICAgIFwicGFyYW1ldGVyc1wiOiB7XG4gICAgICAgICAgICAgIFwiTmFtZVwiOiBcIlByb2RcIixcbiAgICAgICAgICAgICAgXCJQYXJlbnRJZFwiOiB7XG4gICAgICAgICAgICAgICAgXCJGbjo6R2V0QXR0XCI6IFtcbiAgICAgICAgICAgICAgICAgIFwiT3JnYW5pemF0aW9uUm9vdEN1c3RvbVJlc291cmNlOTQxNjk1MEJcIixcbiAgICAgICAgICAgICAgICAgIFwiUm9vdHMuMC5JZFwiXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJDdXN0b206OkFjY291bnRDcmVhdGlvblwiLCB7XG4gICAgICAgIFwiRW1haWxcIjoge1xuICAgICAgICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBcInRlc3QrQWNjb3VudDMtXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJSZWZcIjogXCJBV1M6OkFjY291bnRJZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkB0ZXN0LmNvbVwiXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiQWNjb3VudE5hbWVcIjogXCJBY2NvdW50M1wiLFxuICAgICAgICAgIFwiQWNjb3VudFR5cGVcIjogQWNjb3VudFR5cGUuU1RBR0UsXG4gICAgICAgICAgXCJTdGFnZU5hbWVcIjogXCJzdGFnZTJcIixcbiAgICAgICAgICBcIlN0YWdlT3JkZXJcIjogXCIyXCIsXG4gICAgICAgICAgXCJIb3N0ZWRTZXJ2aWNlc1wiOiBcImFwcDE6YXBwMlwiXG4gICAgfSk7XG5cbn0pO1xuXG50ZXN0KFwic2hvdWxkIGNyZWF0ZSByb290IGRvbWFpbiB6b25lIGFuZCBzdGFnZSBiYXNlZCBkb21haW4gaWYgcm9vdEhvc3RlZFpvbmVETlNOYW1lIGlzIHNwZWNpZmllZCBcIiwgKCkgPT4ge1xuICBjb25zdCBhd3NPcmdhbml6YXRpb25zU3RhY2sgPSBuZXcgQXdzT3JnYW5pemF0aW9uc1N0YWNrKFxuICAgIG5ldyBTdGFjaygpLFxuICAgIFwiQVdTT3JnYW5pemF0aW9uc1N0YWNrXCIsXG4gICAge1xuICAgICAgLi4uYXdzT3JnYW5pemF0aW9uc1N0YWNrUHJvcHMsIFxuICAgICAgcm9vdEhvc3RlZFpvbmVETlNOYW1lOiBcInlvdXJkb21haW4uY29tXCJcbiAgICB9XG4gICk7XG5cbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJBV1M6OlJvdXRlNTM6Okhvc3RlZFpvbmVcIix7XG4gICAgTmFtZTogXCJ5b3VyZG9tYWluLmNvbS5cIlxuICB9KTtcbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9Db3VudFJlc291cmNlcyhcIkFXUzo6Um91dGU1Mzo6UmVjb3JkU2V0XCIsMyk7XG4gIGV4cGVjdChhd3NPcmdhbml6YXRpb25zU3RhY2spLnRvQ291bnRSZXNvdXJjZXMoXCJBV1M6OlJvdXRlNTM6Okhvc3RlZFpvbmVcIiw0KTtcbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJBV1M6OlJvdXRlNTM6OlJlY29yZFNldFwiLHtcbiAgICBOYW1lOiBcInRoZXN0YWdlLnlvdXJkb21haW4uY29tLlwiLFxuICAgIFR5cGU6IFwiTlNcIlxuICB9KTtcbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJBV1M6OlJvdXRlNTM6OlJlY29yZFNldFwiLHtcbiAgICBOYW1lOiBcImFjY291bnQyLnlvdXJkb21haW4uY29tLlwiLFxuICAgIFR5cGU6IFwiTlNcIlxuICB9KTtcbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJBV1M6OlJvdXRlNTM6OlJlY29yZFNldFwiLHtcbiAgICBOYW1lOiBcImFjY291bnQzLnlvdXJkb21haW4uY29tLlwiLFxuICAgIFR5cGU6IFwiTlNcIlxuICB9KTtcbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJBV1M6OlJvdXRlNTM6Okhvc3RlZFpvbmVcIix7XG4gICAgTmFtZTogXCJhY2NvdW50My55b3VyZG9tYWluLmNvbS5cIlxuICB9KTtcblxuICBleHBlY3QoYXdzT3JnYW5pemF0aW9uc1N0YWNrKS50b0hhdmVSZXNvdXJjZShcIkFXUzo6SUFNOjpSb2xlXCIse1xuICAgIFJvbGVOYW1lOiBcImFjY291bnQyLnlvdXJkb21haW4uY29tLWRucy11cGRhdGVcIlxuICB9KTtcbn0pO1xuXG50ZXN0KFwic2hvdWxkIG5vdCBjcmVhdGUgYW55IHpvbmUgaWYgbm8gZG9tYWluIGlzIHByb3ZpZGVkXCIsICgpID0+IHtcbiAgY29uc3QgYXdzT3JnYW5pemF0aW9uc1N0YWNrID0gbmV3IEF3c09yZ2FuaXphdGlvbnNTdGFjayhcbiAgICBuZXcgU3RhY2soKSxcbiAgICBcIkFXU09yZ2FuaXphdGlvbnNTdGFja1wiLFxuICAgIHtcbiAgICAgIC4uLmF3c09yZ2FuaXphdGlvbnNTdGFja1Byb3BzLFxuICAgIH1cbiAgKTtcblxuICBleHBlY3QoYXdzT3JnYW5pemF0aW9uc1N0YWNrKS50b0NvdW50UmVzb3VyY2VzKFwiQVdTOjpSb3V0ZTUzOjpIb3N0ZWRab25lXCIsMCk7XG59KTtcblxudGVzdChcInNob3VsZCBoYXZlIGhhdmUgZW1haWwgdmFsaWRhdGlvbiBzdGFjayB3aXRoIGZvcmNlRW1haWxWZXJpZmljYXRpb24gc2V0IHRvIHRydWVcIiwgKCkgPT4ge1xuXG4gIGNvbnN0IGF3c09yZ2FuaXphdGlvbnNTdGFjayA9IG5ldyBBd3NPcmdhbml6YXRpb25zU3RhY2soXG4gICAgbmV3IFN0YWNrKCksXG4gICAgXCJBV1NPcmdhbml6YXRpb25zU3RhY2tcIixcbiAgICB7Li4uYXdzT3JnYW5pemF0aW9uc1N0YWNrUHJvcHMsIGZvcmNlRW1haWxWZXJpZmljYXRpb246IHRydWV9XG4gICk7XG5cbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJDdXN0b206OkVtYWlsVmFsaWRhdGlvblwiKTtcbn0pXG5cbnRlc3QoXCJzaG91bGQgbm90IGhhdmUgaGF2ZSBlbWFpbCB2YWxpZGF0aW9uIHN0YWNrIHdpdGggZm9yY2VFbWFpbFZlcmlmaWNhdGlvbiBzZXQgdG8gZmFsc2VcIiwgKCkgPT4ge1xuXG4gIGNvbnN0IGF3c09yZ2FuaXphdGlvbnNTdGFjayA9IG5ldyBBd3NPcmdhbml6YXRpb25zU3RhY2soXG4gICAgbmV3IFN0YWNrKCksXG4gICAgXCJBV1NPcmdhbml6YXRpb25zU3RhY2tcIixcbiAgICB7Li4uYXdzT3JnYW5pemF0aW9uc1N0YWNrUHJvcHMsIGZvcmNlRW1haWxWZXJpZmljYXRpb246IGZhbHNlfVxuICApO1xuXG4gIGV4cGVjdChhd3NPcmdhbml6YXRpb25zU3RhY2spLm5vdC50b0hhdmVSZXNvdXJjZShcIkN1c3RvbTo6RW1haWxWYWxpZGF0aW9uXCIpO1xufSlcblxudGVzdChcInNob3VsZCBoYXZlIGhhdmUgZW1haWwgdmFsaWRhdGlvbiBzdGFjayBieSBkZWZhdWx0IHdpdGhvdXQgc2V0dGluZyBmb3JjZUVtYWlsVmVyaWZpY2F0aW9uXCIsICgpID0+IHtcbiAgY29uc3QgYXdzT3JnYW5pemF0aW9uc1N0YWNrID0gbmV3IEF3c09yZ2FuaXphdGlvbnNTdGFjayhcbiAgICBuZXcgU3RhY2soKSxcbiAgICBcIkFXU09yZ2FuaXphdGlvbnNTdGFja1wiLFxuICAgIGF3c09yZ2FuaXphdGlvbnNTdGFja1Byb3BzXG4gICk7XG5cbiAgZXhwZWN0KGF3c09yZ2FuaXphdGlvbnNTdGFjaykudG9IYXZlUmVzb3VyY2UoXCJDdXN0b206OkVtYWlsVmFsaWRhdGlvblwiKTtcbn0pOyJdfQ==