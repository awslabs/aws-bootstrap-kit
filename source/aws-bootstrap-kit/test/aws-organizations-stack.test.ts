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

import "@aws-cdk/assert/jest";
import { AwsOrganizationsStack, AwsOrganizationsStackProps } from "../lib/aws-organizations-stack";
import { Stack } from "@aws-cdk/core";
import {version} from '../package.json';

test("when I define 1 OU with 2 accounts and 1 OU with 1 account then the stack should have 2 OU constructs and 3 account constructs", () => {

    const stack = new Stack();

    let awsOrganizationsStackProps: AwsOrganizationsStackProps;
    awsOrganizationsStackProps = {
        email: "test@test.com",
        pipelineDeployableRegions: [
          'us-east-1',
          'eu-west-1'
        ],
        nestedOU: [
            {
                name: 'OU1',
                accounts: [
                    {
                        name: 'Account1'
                    },
                    {
                        name: 'Account2'
                    }
                ]
            },
            {
                name: 'OU2',
                accounts: [
                    {
                        name: 'Account3'
                    }
                ]
            }
        ]
    }

    const awsOrganizationsStack = new AwsOrganizationsStack(stack, "AWSOrganizationsStack", awsOrganizationsStackProps);

    expect(awsOrganizationsStack.templateOptions.description).toMatch(`(version:${version})`);

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
              "Name": "OU1",
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
          "AccountName": "Account1"
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
          "AccountName": "Account2"
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
              "Name": "OU2",
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
          "AccountName": "Account3"
    });
});
