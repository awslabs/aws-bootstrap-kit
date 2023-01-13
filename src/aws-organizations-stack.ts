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

import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct, IDependable } from 'constructs';
import { Account, AccountType } from './account';
import { RootDns } from './dns';
import { Organization } from './organization';
import { OrganizationTrail } from './organization-trail';
import { OrganizationalUnit } from './organizational-unit';
import { SecureRootUser } from './secure-root-user';
import { ValidateEmail } from './validate-email';

const version = require('../package.json').version;

/**
 * AWS Account input details
 */
export interface AccountSpec {

  /**
   * The name of the AWS account
   */
  readonly name: string;
  /**
   * The (optional) id of the account to reuse, instead of creating a new account
   */
  readonly existingAccountId?: string;
  /**
   * The email associated to the AWS account
   */
  readonly email?: string;
  /**
   * The account type
   */
  readonly type?: AccountType;
  /**
   * The (optional) Stage name to be used in CI/CD pipeline
   */
  readonly stageName?: string;
  /**
   * The (optional) Stage deployment order
   */
  readonly stageOrder?: number;
  /**
   *  List of your services that will be hosted in this account. Set it to [ALL] if you don't plan to have dedicated account for each service.
   */
  readonly hostedServices?: string[];
  /**
   * RemovalPolicy of the account (wether it must be retained or destroyed).
   * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
   *
   * As an account cannot be deleted, RETAIN is the default value.
   *
   * If you choose DESTROY instead (default behavior of CloudFormation), the stack deletion will fail and
   * you will have to manually remove the account from the organization before retrying to delete the stack:
   * https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_remove.html
   *
   * Note that existing accounts (when using `existingAccountId`) are retained whatever the removalPolicy is.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Organizational Unit Input details
 */
export interface OUSpec {
  /**
   * Name of the Organizational Unit
   */
  readonly name: string;

  /**
   * Accounts' specification inside in this Organizational Unit
   */
  readonly accounts?: AccountSpec[];

  /**
   * Specification of sub Organizational Unit
   */
  readonly nestedOU?: OUSpec[];
}

/**
 * Properties for AWS SDLC Organizations Stack
 * @experimental
 */
export interface AwsOrganizationsStackProps extends StackProps {

  /**
   * Email address of the Root account
   */
  readonly email: string;

  /**
   * Specification of the sub Organizational Unit
   */
  readonly nestedOU: OUSpec[];

  /**
   * The main DNS domain name to manage
   */
  readonly rootHostedZoneDNSName?: string;

  /**
   * The (optional) existing root hosted zone id to use instead of creating one
   */
  readonly existingRootHostedZoneId?: string;

  /**
   * A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party
   */
  readonly thirdPartyProviderDNSUsed?: boolean;

  /**
  * Enable Email Verification Process
  */
  readonly forceEmailVerification?: boolean;
}

/**
 * A Stack creating the Software Development Life Cycle (SDLC) Organization
 */
export class AwsOrganizationsStack extends Stack {

  private readonly emailPrefix?: string;
  private readonly domain?: string;
  private readonly stageAccounts: Account[] = [];
  public readonly rootDns?: RootDns;

  private createOrganizationTree(oUSpec: OUSpec, parentId: string, previousSequentialConstruct: IDependable): IDependable {

    let organizationalUnit = new OrganizationalUnit(this, `${oUSpec.name}-OU`, { Name: oUSpec.name, ParentId: parentId });
    //adding an explicit dependency as CloudFormation won't infer that Organization, Organizational Units and Accounts must be created or modified sequentially
    organizationalUnit.node.addDependency(previousSequentialConstruct);

    previousSequentialConstruct = organizationalUnit;

    oUSpec.accounts?.forEach(accountSpec => {
      let accountEmail: string;
      if (accountSpec.email) {
        accountEmail = accountSpec.email;
      } else if (this.emailPrefix && this.domain) {
        accountEmail = `${this.emailPrefix}+${accountSpec.name}-${Stack.of(this).account}@${this.domain}`;
      } else {
        throw new Error(`Master account email must be provided or an account email for account ${accountSpec.name}`);
      }

      let account = new Account(this, accountSpec.name, {
        email: accountEmail,
        name: accountSpec.name,
        parentOrganizationalUnitId: organizationalUnit.id,
        type: accountSpec.type,
        stageName: accountSpec.stageName,
        stageOrder: accountSpec.stageOrder,
        hostedServices: accountSpec.hostedServices,
        id: accountSpec.existingAccountId,
        removalPolicy: accountSpec.removalPolicy,
      });

      // Adding an explicit dependency as CloudFormation won't infer that Organization, Organizational Units and Accounts must be created or modified sequentially
      account.node.addDependency(previousSequentialConstruct);
      previousSequentialConstruct = account;

      // Building stageAccounts array to be used for DNS delegation system
      if (accountSpec.type == AccountType.STAGE) {
        this.stageAccounts.push(account);
      }
    });

    oUSpec.nestedOU?.forEach(nestedOU => {
      previousSequentialConstruct = this.createOrganizationTree(nestedOU, organizationalUnit.id, previousSequentialConstruct);
    });

    return previousSequentialConstruct;
  }

  constructor(scope: Construct, id: string, props: AwsOrganizationsStackProps) {
    super(scope, id, { description: `Software development Landing Zone (uksb-1r7an8o45) (version:${version})`, ...props });
    const { email, nestedOU, forceEmailVerification = true } = props;

    if (nestedOU.length > 0) {
      let org = new Organization(this, 'Organization');
      if (email) {
        this.emailPrefix = email.split('@', 2)[0];
        this.domain = email.split('@', 2)[1];

        if (forceEmailVerification) {
          const validateEmail = new ValidateEmail(this, 'EmailValidation', { email });
          org.node.addDependency(validateEmail);
        }
      }

      let orgTrail = new OrganizationTrail(this, 'OrganizationTrail', { OrganizationId: org.id });
      orgTrail.node.addDependency(org);

      let previousSequentialConstruct: IDependable = orgTrail;

      nestedOU.forEach(nestedOU => {
        previousSequentialConstruct = this.createOrganizationTree(nestedOU, org.rootId, previousSequentialConstruct);
      });
    }

    if (props.rootHostedZoneDNSName) {
      this.rootDns = new RootDns(this, 'RootDNS', {
        stagesAccounts: this.stageAccounts,
        rootHostedZoneDNSName: props.rootHostedZoneDNSName,
        existingRootHostedZoneId: props.existingRootHostedZoneId,
        thirdPartyProviderDNSUsed: props.thirdPartyProviderDNSUsed?props.thirdPartyProviderDNSUsed:true,
      });
    }

    new SecureRootUser(this, 'SecureRootUser', email);
  }
}
