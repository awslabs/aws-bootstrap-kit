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

import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns'
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import {Organization} from './organization'
import {OrganizationalUnit} from './organizational-unit'
import {Account} from './account';
import {SecureRootUser} from './secure-root-user';
import {OrganizationTrail} from './organization-trail';
import {version} from '../package.json';

/**
 * AWS Account input details
 */
export interface AccountSpec {

  /**
   * The name of the AWS account
   */
  readonly name: string,

  /**
   * The email associated to the AWS account
   */
  readonly email?: string
}

/**
 * Organizational Unit Input details
 */
export interface OUSpec {
  /**
   * Name of the Organizational Unit
   */
  readonly name: string,

  /**
   * Accounts' specification inside in this Organizational Unit
   */
  readonly accounts: AccountSpec[],

  /**
   * Specification of sub Organizational Unit
   */
  readonly nestedOU?: OUSpec[]
}

/**
 * Properties for AWS SDLC Organizations Stack
 * @experimental
 */
export interface AwsOrganizationsStackProps extends cdk.StackProps {

  /**
   * Email address of the Root account
   */
  readonly email: string,

  /**
   * Specification of the sub Organizational Unit
   */
  readonly nestedOU: OUSpec[],

  /**
   * Regions to be bootstrap with CDK for deployment. The format of values is the region short-name (e.g. eu-west-1)
   */
  readonly regionsToBootstrap: string[],
}

/**
 * A Stack creating the Software Life Cycle (SDLC) Organization
 */
export class AwsOrganizationsStack extends cdk.Stack {

  private readonly emailPrefix?: string;
  private readonly domain?: string;

  private createOrganizationTree(oUSpec: OUSpec, parentId: string, previousSequentialConstruct: cdk.IDependable): cdk.IDependable {

    let organizationalUnit = new OrganizationalUnit(this, `${oUSpec.name}-OU`, {Name: oUSpec.name, ParentId: parentId});
    //adding an explicit dependency as CloudFormation won't infer that Organization, Organizational Units and Accounts must be created or modified sequentially
    organizationalUnit.node.addDependency(previousSequentialConstruct);

    previousSequentialConstruct = organizationalUnit;

    oUSpec.accounts.forEach(accountSpec => {

      let accountEmail: string;
      if(accountSpec.email)
      {
        accountEmail = accountSpec.email;
      }
      else if(this.emailPrefix && this.domain)
      {
        accountEmail = `${this.emailPrefix}+${accountSpec.name}-${cdk.Stack.of(this).account}@${this.domain}`
      }
      else
      {
        throw new Error(`Master account email must be provided or an account email for account ${accountSpec.name}`)
      }

      let account = new Account(this, accountSpec.name, {
        email: accountEmail,
        name: accountSpec.name,
        parentOrganizationalUnitId: organizationalUnit.id
      });
      //adding an explicit dependency as CloudFormation won't infer that Organization, Organizational Units and Accounts must be created or modified sequentially
      account.node.addDependency(previousSequentialConstruct);
      previousSequentialConstruct = account;
    });

    oUSpec.nestedOU?.forEach(nestedOU => {
      previousSequentialConstruct = this.createOrganizationTree(nestedOU, organizationalUnit.id, previousSequentialConstruct);
    });

    return previousSequentialConstruct;
  }

  constructor(scope: cdk.Construct, id: string, props: AwsOrganizationsStackProps) {
    super(scope, id, {description: `Software development Landing Zone (uksb-1r7an8o45) (version:${version})`, ...props});


    if(props.nestedOU.length > 0)
    {
      let org = new Organization(this, "Organization");
      if(props.email)
      {
        this.emailPrefix = props.email.split('@', 2)[0];
        this.domain = props.email.split('@', 2)[1];
      }

      let previousSequentialConstruct: cdk.IDependable = org;

      props.nestedOU.forEach(nestedOU => {
        previousSequentialConstruct = this.createOrganizationTree(nestedOU, org.rootId, previousSequentialConstruct);
      });

      let orgTrail = new OrganizationTrail(this, 'OrganizationTrail', {OrganizationId: org.id});
      orgTrail.node.addDependency(org);
    }

    const secureRootUserConfigTopic = new sns.Topic(this, 'SecureRootUserConfigTopic');
    secureRootUserConfigTopic.addSubscription(new subs.EmailSubscription(props.email));

    new SecureRootUser(this, 'SecureRootUser', secureRootUserConfigTopic);

  }
}
