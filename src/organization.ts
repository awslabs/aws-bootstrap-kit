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

import { CustomResource } from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { OrganizationProvider } from './organization-provider';

/**
 * This represents an Organization
 */
export class Organization extends Construct {
  /**
   * The Id of the Organization
   */
  readonly id: string;

  /**
   * The Id of the root Organizational Unit of the Organization
   */
  readonly rootId: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    let orgProvider = new OrganizationProvider(this, 'orgProvider');

    let org = new CustomResource(this, 'orgCustomResource', {
      serviceToken: orgProvider.provider.serviceToken,
      resourceType: 'Custom::OrganizationCreation',
    });

    this.id = org.getAtt('OrganizationId').toString();

    let root = new cr.AwsCustomResource(this, 'RootCustomResource', {
      onCreate: {
        service: 'Organizations',
        action: 'listRoots',
        physicalResourceId: cr.PhysicalResourceId.fromResponse('Roots.0.Id'),
        region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
      },
      onUpdate: {
        service: 'Organizations',
        action: 'listRoots',
        physicalResourceId: cr.PhysicalResourceId.fromResponse('Roots.0.Id'),
        region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
      },
      onDelete: {
        service: 'Organizations',
        action: 'listRoots',
        physicalResourceId: cr.PhysicalResourceId.fromResponse('Roots.0.Id'),
        region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
      },
      installLatestAwsSdk: false,
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // Enabling SSM AWS Service access to be able to register delegated adminstrator
    const enableSSMAWSServiceAccess = this.enableAWSServiceAccess('ssm.amazonaws.com');
    const enableMultiAccountsSetupAWSServiceAccess = this.enableAWSServiceAccess('config-multiaccountsetup.amazonaws.com');

    enableMultiAccountsSetupAWSServiceAccess.node.addDependency(org);
    enableSSMAWSServiceAccess.node.addDependency(enableMultiAccountsSetupAWSServiceAccess);

    //adding an explicit dependency as CloudFormation won't infer that calling listRoots must be done only when Organization creation is finished
    //as there is no implicit dependency between the 2 custom resources
    root.node.addDependency(org);

    this.rootId = root.getResponseField('Roots.0.Id');
  }

  private enableAWSServiceAccess(principal: string) {
    const resourceName =
      principal === 'ssm.amazonaws.com'
        ? 'EnableSSMAWSServiceAccess'
        : 'EnableMultiAccountsSetup';

    return new cr.AwsCustomResource(this, resourceName, {
      onCreate: {
        service: 'Organizations',
        action: 'enableAWSServiceAccess',
        physicalResourceId: cr.PhysicalResourceId.of(resourceName),
        region: 'us-east-1',
        parameters: {
          ServicePrincipal: principal,
        },
      },
      onDelete: {
        service: 'Organizations',
        action: 'disableAWSServiceAccess',
        region: 'us-east-1',
        parameters: {
          ServicePrincipal: principal,
        },
      },
      installLatestAwsSdk: false,
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }
}
