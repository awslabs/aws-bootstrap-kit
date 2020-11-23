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

import * as path from "path";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import {
  Construct,
  Duration,
  Stack,
  NestedStack,
} from "@aws-cdk/core";
import { Provider } from "@aws-cdk/custom-resources";

export default class ValidateEmailProvider extends NestedStack {
  readonly provider: Provider;

  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-bootstrap-kit.ValidateEmailProvider';
    return stack.node.tryFindChild(uid) as ValidateEmailProvider || new ValidateEmailProvider(stack, uid);
  }

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const code = lambda.Code.fromAsset(
      path.join(__dirname, "validate-email-handler")
    );

    const onEventHandler = new lambda.Function(this, "OnEventHandler", {
      code,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.onEventHandler",
      timeout: Duration.minutes(5)
    });

    onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:verifyEmailIdentity"],
        resources: ["*"]
      })
    );

    const isCompleteHandler = new lambda.Function(this, "IsCompleteHandler", {
      code,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.isCompleteHandler",
      timeout: Duration.minutes(10)
    });

    isCompleteHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "ses:getIdentityVerificationAttributes",
        ],
        resources: ["*"]
      })
    );

    this.provider = new Provider(this, "EmailValidationProvider", {
      onEventHandler: onEventHandler,
      isCompleteHandler: isCompleteHandler,
      queryInterval: Duration.seconds(10)
    });
  }
}
