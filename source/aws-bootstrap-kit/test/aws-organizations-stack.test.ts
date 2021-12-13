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
import { AccountType, AwsOrganizationsStack, AwsOrganizationsStackProps } from "../lib";
import { Stack } from "aws-cdk-lib";
import {version} from '../package.json';

const awsOrganizationsStackProps: AwsOrganizationsStackProps = {
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

    const stack = new Stack();
    let awsOrganizationsStackProps: AwsOrganizationsStackProps;
    awsOrganizationsStackProps = {
        email: "test@test.com",
        nestedOU: [
            {
                name: 'SDLC',
                accounts: [
                    {
                        name: 'Account1',
                        type: AccountType.PLAYGROUND,
                        hostedServices: ['app1', 'app2']
                    },
                    {
                        name: 'Account2',
                        type: AccountType.STAGE,
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
                        type: AccountType.STAGE,
                        stageOrder: 2,
                        stageName: 'stage2',
                        hostedServices: ['app1', 'app2']
                    }
                ]
            }
        ]
    };


    const awsOrganizationsStack = new AwsOrganizationsStack(stack, "AWSOrganizationsStack", awsOrganizationsStackProps);

    expect(awsOrganizationsStack.templateOptions.description).toMatch(`(version:${version})`);

    expect(awsOrganizationsStack).toHaveResource("Custom::AWS", {
        "Create": JSON.stringify({
            "service": "Organizations",
            "action": "createOrganization",
            "physicalResourceId": {
              "responsePath": "Organization.Id"
            },
            "region": "us-east-1"
          }),
          "Delete": JSON.stringify({
            "service": "Organizations",
            "action": "deleteOrganization",
            "region": "us-east-1"
          })
    });


    expect(awsOrganizationsStack).toHaveResource("Custom::AWS", {
        "Create": {
          "Fn::Join": [
          "",
          [
            "{\"service\":\"Organizations\",\"action\":\"createOrganizationalUnit\",\"physicalResourceId\":{\"responsePath\":\"OrganizationalUnit.Id\"},\"region\":\"us-east-1\",\"parameters\":{\"Name\":\"Prod\",\"ParentId\":\"",
            {
              "Fn::GetAtt": [
                "OrganizationRootCustomResource9416950B",
                "Roots.0.Id"
              ]
            },
            "\"}}"
          ]
        ]
      },
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
        "AccountType": AccountType.PLAYGROUND,
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
          "AccountType": AccountType.STAGE,
          "StageName": "stage1",
          "StageOrder": "1",
          "HostedServices": "app1:app2"
    });

    expect(awsOrganizationsStack).toHaveResource("Custom::AWS", {
        "Create": {
          "Fn::Join": [
            "",
            [
              "{\"service\":\"Organizations\",\"action\":\"createOrganizationalUnit\",\"physicalResourceId\":{\"responsePath\":\"OrganizationalUnit.Id\"},\"region\":\"us-east-1\",\"parameters\":{\"Name\":\"Prod\",\"ParentId\":\"",
              {
                "Fn::GetAtt": [
                  "OrganizationRootCustomResource9416950B",
                  "Roots.0.Id"
                ]
              },
              "\"}}"
            ]
          ]
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
          "AccountType": AccountType.STAGE,
          "StageName": "stage2",
          "StageOrder": "2",
          "HostedServices": "app1:app2"
    });

});

test("should create root domain zone and stage based domain if rootHostedZoneDNSName is specified ", () => {
  const awsOrganizationsStack = new AwsOrganizationsStack(
    new Stack(),
    "AWSOrganizationsStack",
    {
      ...awsOrganizationsStackProps,
      rootHostedZoneDNSName: "yourdomain.com"
    }
  );

  expect(awsOrganizationsStack).toHaveResource("AWS::Route53::HostedZone",{
    Name: "yourdomain.com."
  });
  expect(awsOrganizationsStack).toCountResources("AWS::Route53::RecordSet",3);
  expect(awsOrganizationsStack).toCountResources("AWS::Route53::HostedZone",4);
  expect(awsOrganizationsStack).toHaveResource("AWS::Route53::RecordSet",{
    Name: "thestage.yourdomain.com.",
    Type: "NS"
  });
  expect(awsOrganizationsStack).toHaveResource("AWS::Route53::RecordSet",{
    Name: "account2.yourdomain.com.",
    Type: "NS"
  });
  expect(awsOrganizationsStack).toHaveResource("AWS::Route53::RecordSet",{
    Name: "account3.yourdomain.com.",
    Type: "NS"
  });
  expect(awsOrganizationsStack).toHaveResource("AWS::Route53::HostedZone",{
    Name: "account3.yourdomain.com."
  });

  expect(awsOrganizationsStack).toHaveResource("AWS::IAM::Role",{
    RoleName: "account2.yourdomain.com-dns-update"
  });
});

test("should not create any zone if no domain is provided", () => {
  const awsOrganizationsStack = new AwsOrganizationsStack(
    new Stack(),
    "AWSOrganizationsStack",
    {
      ...awsOrganizationsStackProps,
    }
  );

  expect(awsOrganizationsStack).toCountResources("AWS::Route53::HostedZone",0);
});

test("should have have email validation stack with forceEmailVerification set to true", () => {

  const awsOrganizationsStack = new AwsOrganizationsStack(
    new Stack(),
    "AWSOrganizationsStack",
    {...awsOrganizationsStackProps, forceEmailVerification: true}
  );

  expect(awsOrganizationsStack).toHaveResource("Custom::EmailValidation");
})

test("should not have have email validation stack with forceEmailVerification set to false", () => {

  const awsOrganizationsStack = new AwsOrganizationsStack(
    new Stack(),
    "AWSOrganizationsStack",
    {...awsOrganizationsStackProps, forceEmailVerification: false}
  );

  expect(awsOrganizationsStack).not.toHaveResource("Custom::EmailValidation");
})

test("should have have email validation stack by default without setting forceEmailVerification", () => {
  const awsOrganizationsStack = new AwsOrganizationsStack(
    new Stack(),
    "AWSOrganizationsStack",
    awsOrganizationsStackProps
  );

  expect(awsOrganizationsStack).toHaveResource("Custom::EmailValidation");
});