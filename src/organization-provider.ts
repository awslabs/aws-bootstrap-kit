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

import { Construct } from "constructs";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { Provider } from "aws-cdk-lib/custom-resources";

/**
 * A Custom Resource provider capable of creating AWS Organization or reusing an existing one
 */
export class OrganizationProvider extends Construct {
  /**
   * The custom resource provider.
   */
  public readonly provider: Provider;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    let createOrgHandler = new lambda.Function(this, "OnEventHandler", {
      code: lambda.Code.fromAsset(path.join(__dirname, "organization-handler")),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.onEventHandler",
      timeout: Duration.minutes(5),
    });

    createOrgHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "organizations:CreateOrganization",
          "organizations:DescribeOrganization",
        ],
        resources: ["*"],
      })
    );

    /*
     * the lambda needs to have the iam:CreateServiceLinkedRole permission so that the AWS Organizations service can create
     * Service Linked Role on its behalf
    */
    createOrgHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["iam:CreateServiceLinkedRole"],
        resources: ["arn:aws:iam::*:role/*"],
      })
    );

    this.provider = new Provider(this, "orgProvider", {
      onEventHandler: createOrgHandler
    });
  }
}
