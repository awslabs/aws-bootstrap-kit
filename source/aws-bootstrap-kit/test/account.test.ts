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

import { expect as expectCDK, haveResource, countResourcesLike } from "@aws-cdk/assert";
import { Account, AccountType } from "../lib/account";
import { Stack } from "aws-cdk-lib";

test("HappyCase no DNS don't set delegation", () => {
  const stack = new Stack()
  new Account(stack, "myAccount", {
    email: "fakeEmail",
    name: "fakeAccountName",
    type: AccountType.PLAYGROUND,
    parentOrganizationalUnitId: "fakeOUId",
  });

  expectCDK(stack).to(
    haveResource("Custom::AccountCreation", {
      Email: "fakeEmail",
      AccountName: "fakeAccountName",
    })
  );

  expectCDK(stack).to(haveResource("Custom::AWS", {
    "Create": {
      "Fn::Join": [
        "",
        [
          "{\"service\":\"Organizations\",\"action\":\"tagResource\",\"region\":\"us-east-1\",\"physicalResourceId\":{\"id\":\"tags-",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\"},\"parameters\":{\"ResourceId\":\"",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\",\"Tags\":[{\"Key\":\"Email\",\"Value\":\"fakeEmail\"},{\"Key\":\"AccountName\",\"Value\":\"fakeAccountName\"},{\"Key\":\"AccountType\",\"Value\":\"PLAYGROUND\"}]}}"
        ]
      ]
    },
    "Update": {
      "Fn::Join": [
        "",
        [
          "{\"service\":\"Organizations\",\"action\":\"tagResource\",\"region\":\"us-east-1\",\"physicalResourceId\":{\"id\":\"tags-",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\"},\"parameters\":{\"ResourceId\":\"",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\",\"Tags\":[{\"Key\":\"Email\",\"Value\":\"fakeEmail\"},{\"Key\":\"AccountName\",\"Value\":\"fakeAccountName\"},{\"Key\":\"AccountType\",\"Value\":\"PLAYGROUND\"}]}}"
        ]
      ]
    },
    "Delete": {
      "Fn::Join": [
        "",
        [
          "{\"service\":\"Organizations\",\"action\":\"untagResource\",\"region\":\"us-east-1\",\"parameters\":{\"ResourceId\":\"",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\",\"TagKeys\":[\"Email\",\"AccountName\",\"AccountType\"]}}"
        ]
      ]
    }
  }));

  expectCDK(stack).to(countResourcesLike("Custom::AWS", 0, {
    "Create": {
      "Fn::Join": [
        "",
        [
          "{\"service\":\"Organizations\",\"action\":\"registerDelegatedAdministrator\",\"physicalResourceId\":{\"id\":\"registerDelegatedAdministrator\"},\"region\":\"us-east-1\",\"parameters\":{\"AccountId\":\"",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\",\"ServicePrincipal\":\"config-multiaccountsetup.amazonaws.com\"}}"
        ]
      ]
    }

  }));
});


test("HappyCase with DNS create admin delegation", () => {
  const stack = new Stack();
  stack.node.setContext("domain_name", "example.com");
  new Account(stack, "myAccount", {
    email: "fakeEmail",
    name: "fakeAccountName",
    parentOrganizationalUnitId: "fakeOUId",
  });

  expectCDK(stack).to(
    haveResource("Custom::AccountCreation", {
      Email: "fakeEmail",
      AccountName: "fakeAccountName",
    })
  );

  expectCDK(stack).to(countResourcesLike("Custom::AWS", 1, {
    "Create": {
      "Fn::Join": [
        "",
        [
          "{\"service\":\"Organizations\",\"action\":\"registerDelegatedAdministrator\",\"physicalResourceId\":{\"id\":\"registerDelegatedAdministrator\"},\"region\":\"us-east-1\",\"parameters\":{\"AccountId\":\"",
          {
            "Fn::GetAtt": [
              "myAccountAccountfakeAccountNameA6CEFA53",
              "AccountId"
            ]
          },
          "\",\"ServicePrincipal\":\"config-multiaccountsetup.amazonaws.com\"}}"
        ]
      ]
    }

  }));
});