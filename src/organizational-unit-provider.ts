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
import { Duration, NestedStack, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

/**
 * A Custom Resource provider capable of creating AWS Organizational Units (OUs) or reusing an existing one
 */
export class OrganizationalUnitProvider extends NestedStack {

  /**
   * Creates a stack-singleton resource provider nested stack.
   */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-bootstrap-kit.OUProvider';
    return stack.node.tryFindChild(uid) as OrganizationalUnitProvider || new OrganizationalUnitProvider(stack, uid);
  }

  /**
   * The custom resource provider.
   */
  public readonly provider: Provider;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    let createOUHandler = new lambda.Function(this, 'OnEventHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'ou-handler')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.onEventHandler',
      timeout: Duration.minutes(5),
    });

    createOUHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'organizations:ListOrganizationalUnitsForParent',
          'organizations:CreateOrganizationalUnit',
          'organizations:UpdateOrganizationalUnit',
        ],
        resources: ['*'],
      }),
    );

    this.provider = new Provider(this, 'OUProvider', {
      onEventHandler: createOUHandler,
    });
  }
}
