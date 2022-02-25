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

import {Construct, IDependable} from 'constructs';
import {Stack, StackProps} from 'aws-cdk-lib';
import {Organization} from './organization';
import {OrganizationalUnit} from './organizational-unit';
import {Account, AccountType} from './account';
import {SecureRootUser} from './secure-root-user';
import {OrganizationTrail} from './organization-trail';
import {version} from '../package.json';
import { RootDns } from './dns';
import { ValidateEmail } from './validate-email';

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
export interface AwsOrganizationsStackProps extends StackProps {

  /**
   * Email address of the Root account
   */
  readonly email: string,

  /**
   * Specification of the sub Organizational Unit
   */
  readonly nestedOU: OUSpec[],

  /**
   * A boolean used to set if AWS Organizations is already existed. If it sets to `true`, instead of creating the AWS Organizations, an existing one would be loaded
   */
  readonly organizationsExist?: boolean,
  /**
   * The main DNS domain name to manage
   */
  readonly rootHostedZoneDNSName?: string,

  /**
   * A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party
   */
  readonly thirdPartyProviderDNSUsed?: boolean,

  /**
  * Enable Email Verification Process
  */
  readonly forceEmailVerification?: boolean,
}

/**
 * A Stack creating the Software Development Life Cycle (SDLC) Organization
 */
export class AwsOrganizationsStack extends Stack {

  private readonly emailPrefix?: string;
  private readonly domain?: string;
  private readonly stageAccounts: Account[] = [];

  private createOrganizationTree(oUSpec: OUSpec, parentId: string, previousSequentialConstruct: IDependable): IDependable {

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
        accountEmail = `${this.emailPrefix}+${accountSpec.name}-${Stack.of(this).account}@${this.domain}`
      }
      else
      {
        throw new Error(`Master account email must be provided or an account email for account ${accountSpec.name}`)
      }

      let account = new Account(this, accountSpec.name, {
        email: accountEmail,
        name: accountSpec.name,
        parentOrganizationalUnitId: organizationalUnit.id,
        type: accountSpec.type,
        stageName: accountSpec.stageName,
        stageOrder: accountSpec.stageOrder,
        hostedServices: accountSpec.hostedServices
      });
      // Adding an explicit dependency as CloudFormation won't infer that Organization, Organizational Units and Accounts must be created or modified sequentially
      account.node.addDependency(previousSequentialConstruct);
      previousSequentialConstruct = account;

      // Building stageAccounts array to be used for DNS delegation system
      if(['Prod', 'SDLC'].includes(oUSpec.name)) {
        this.stageAccounts.push(account);
      }
    });

    oUSpec.nestedOU?.forEach(nestedOU => {
      previousSequentialConstruct = this.createOrganizationTree(nestedOU, organizationalUnit.id, previousSequentialConstruct);
    });

    return previousSequentialConstruct;
  }

  constructor(scope: Construct, id: string, props: AwsOrganizationsStackProps) {
    super(scope, id, {description: `Software development Landing Zone (uksb-1r7an8o45) (version:${version})`, ...props});
    const {email, organizationsExist = false, nestedOU, forceEmailVerification = true} = props;

    if(nestedOU.length > 0)
    {
      let org = new Organization(this, "Organization", organizationsExist);
      if(email)
      {
        this.emailPrefix = email.split('@', 2)[0];
        this.domain = email.split('@', 2)[1];

        if(forceEmailVerification) {
          const validateEmail = new ValidateEmail(this, 'EmailValidation', { email });
          org.node.addDependency(validateEmail);
        }
      }

      let orgTrail = new OrganizationTrail(this, 'OrganizationTrail', {OrganizationId: org.id});
      orgTrail.node.addDependency(org);

      let previousSequentialConstruct: IDependable = orgTrail;

      nestedOU.forEach(nestedOU => {
        previousSequentialConstruct = this.createOrganizationTree(nestedOU, org.rootId, previousSequentialConstruct);
      });


    }

    if(props.rootHostedZoneDNSName){
      new RootDns(this, 'RootDNS', {
        stagesAccounts: this.stageAccounts,
        rootHostedZoneDNSName: props.rootHostedZoneDNSName,
        thirdPartyProviderDNSUsed: props.thirdPartyProviderDNSUsed?props.thirdPartyProviderDNSUsed:true
      });
    }

    new SecureRootUser(this, 'SecureRootUser', email);
  }
}
