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

/**
 * @group unit/secure-root-user
 */

import {expect as expectCDK, haveResource} from "@aws-cdk/assert";
import {Stack} from "aws-cdk-lib";
import {SecureRootUser} from "../../lib/secure-root-user";

test("Get 2FA and Access key rules", () => {
  const stack = new Stack();

  new SecureRootUser(stack, "secureRootUser", 'test@amazon.com');

  expectCDK(stack).to(
    haveResource("AWS::Config::ConfigRule", {
      Source: {
        Owner: "AWS",
        SourceIdentifier: 'ROOT_ACCOUNT_MFA_ENABLED'
      }
    })
  );
  expectCDK(stack).to(
    haveResource("AWS::Config::ConfigRule", {
      Source: {
        Owner: "AWS",
        SourceIdentifier: 'IAM_ROOT_ACCESS_KEY_CHECK'
      }
    })
  );

  expectCDK(stack).to(
    haveResource("AWS::SNS::Topic")
  );

  expectCDK(stack).to(
    haveResource("AWS::IAM::Role", {
      "AssumeRolePolicyDocument": {
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Effect": "Allow",
            "Principal": {
              "Service": [
                "events.amazonaws.com",
                "ssm.amazonaws.com"
              ]
            }
          }
        ],
        "Version": "2012-10-17"
      }
    })
  );
});
