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
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import { NestedStack, Construct, Duration, Stack } from "@aws-cdk/core";
import * as cr from '@aws-cdk/custom-resources';



/**
* A Custom Resource provider capable of importing and creating AWS Organization
*/
export class OrganizationProvider extends NestedStack {

  /**
  * Creates a stack-singleton resource provider nested stack.
  */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-bootstrap-kit.OrganizationProvider';
    return stack.node.tryFindChild(uid) as OrganizationProvider || new OrganizationProvider(stack, uid);
  }

  /**
  * The custom resource provider.
  */
  public readonly provider: cr.Provider;

  /**
  * The onEvent handler
  */
  public readonly onEventHandler: lambda.Function;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const code = lambda.Code.fromAsset(path.join(__dirname, 'organization-handler'));

    this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.onEventHandler',
      timeout: Duration.minutes(5),
    });

    this.onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'organizations:CreateOrganization',
          'organizations:DescribeOrganization',
          'organizations:DeleteOrganization',
          'organizations:ListAccounts'
        ],
        resources: ['*'],
      }),
    );

    this.onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'iam:CreateServiceLinkedRole'
        ],
        resources: ['arn:aws:iam::*:role/aws-service-role/organizations.amazonaws.com/*'],
        conditions: { StringLike: { 'iam:AWSServiceName': 'organizations.amazonaws.com' } }
      }),
    );

    this.provider = new cr.Provider(this, 'OrganizationProvider', {
      onEventHandler: this.onEventHandler
    });
  }
}