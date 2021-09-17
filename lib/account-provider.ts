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

import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, NestedStack, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';


/**
 * A Custom Resource provider capable of creating AWS Accounts
 */
export class AccountProvider extends NestedStack {
  /**
   * Creates a stack-singleton resource provider nested stack.
   */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-bootstrap-kit.AccountProvider';
    return stack.node.tryFindChild(uid) as AccountProvider || new AccountProvider(stack, uid);
  }

  /**
   * The custom resource provider.
   */
  public readonly provider: cr.Provider;

  /**
   * The onEvent handler
   */
  public readonly onEventHandler: lambda.Function;

  /**
   * The isComplete handler
   */
  public readonly isCompleteHandler: lambda.Function;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const code = lambda.Code.fromAsset(path.join(__dirname, 'account-handler'));

    // Issues UpdateTable API calls
    this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.onEventHandler',
      timeout: Duration.minutes(5),
    });

    this.onEventHandler.addToRolePolicy(
        new iam.PolicyStatement({
          actions: [
            'organizations:CreateAccount',
            'organizations:TagResource'
          ],
          resources: ['*'],
        }),
      );

    // Checks if account is ready
    this.isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.isCompleteHandler',
      timeout: Duration.seconds(30),
    });

    this.isCompleteHandler.addToRolePolicy(
        new iam.PolicyStatement({
          actions: [
              'organizations:CreateAccount',
              'organizations:DescribeCreateAccountStatus',
              'organizations:TagResource'
            ],
          resources: ['*'],
        }),
      );

    this.provider = new cr.Provider(this, 'AccountProvider', {
      onEventHandler: this.onEventHandler,
      isCompleteHandler: this.isCompleteHandler,
      queryInterval: Duration.seconds(10),
    });
  }
}
