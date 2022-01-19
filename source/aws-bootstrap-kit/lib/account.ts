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

import {Construct} from 'constructs';
import * as core from "aws-cdk-lib";
import { AccountProvider } from "./account-provider";
import * as cr from "aws-cdk-lib/custom-resources";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { RemovalPolicy } from 'aws-cdk-lib';

/**
 * Properties of an AWS account
 */
export interface IAccountProps {
  /**
   * The email to use to create the AWS account
   */
  email: string;
  /**
   * The name of the AWS Account
   */
  name: string;
  /**
   * The account type
   */
  type?: AccountType;
  /**
   * The (optional) Stage name to be used in CI/CD pipeline
   */
  stageName?: string;
  /**
   * The (optional) Stage deployment order
   */
  stageOrder?: number;
  /**
   *  List of your services that will be hosted in this account. Set it to [ALL] if you don't plan to have dedicated account for each service.
   */
  hostedServices?: string[];
  /**
   * The potential Organizational Unit Id the account should be placed in
   */
  parentOrganizationalUnitId?: string;
  /**
   * The potential Organizational Unit Name the account should be placed in
   */
  parentOrganizationalUnitName?: string;
  /**
   * The AWS account Id
   */
  id?: string;
  /**
   * RemovalPolicy of the account. See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
   *
   * @default RemovalPolicy.RETAIN
   */
  removalPolicy?: RemovalPolicy;
}

export enum AccountType {
  CICD = "CICD",
  DNS = "DNS",
  STAGE = "STAGE",
  PLAYGROUND = "PLAYGROUND"
}

/**
 * An AWS Account
 */
export class Account extends Construct {
  /**
   * Constructor
   *
   * @param scope The parent Construct instantiating this account
   * @param id This instance name
   * @param accountProps Account properties
   */
  readonly accountName: string;
  readonly accountId: string;
  readonly accountStageName?: string;
  readonly accountStageOrder?: number;

  constructor(scope: Construct, id: string, accountProps: IAccountProps) {
    super(scope, id);

    const accountProvider = AccountProvider.getOrCreate(this);

    let existingAccount = false;
    let accountId = accountProps.id;
    let hostedServices = accountProps.hostedServices ? accountProps.hostedServices.join(':') : undefined;

    // do not create account if we reuse one
    let account;
    if (!accountId) {
      account = new core.CustomResource(
        this,
        `Account-${accountProps.name}`,
        {
          serviceToken: accountProvider.provider.serviceToken,
          resourceType: "Custom::AccountCreation",
          properties: {
            Email: accountProps.email,
            AccountName: accountProps.name,
          },
          removalPolicy: accountProps.removalPolicy || RemovalPolicy.RETAIN
        },
      );
      accountId = account.getAtt("AccountId").toString();
      accountProps.id = accountId;
    } else {
      existingAccount = true;

      // retrieve existing account information (actual name and email) to update accountProps
      account = new cr.AwsCustomResource(this, "ExistingAccountCustomResource", {
        onUpdate: {
          service: "Organizations",
          action: "describeAccount",
          physicalResourceId: cr.PhysicalResourceId.fromResponse(
            "Account.Id"
          ),
          region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            AccountId: accountId
          }
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        })
      });

      accountProps.name = account.getResponseField("Account.Name");
      accountProps.email = account.getResponseField("Account.Email");
    }

    // add tags
    const tags: { Key: string; Value: any; }[] = [];
    tags.push({Key: 'Email', Value: accountProps.email});
    tags.push({Key: 'AccountName', Value: accountProps.name});
    if (accountProps.type != null) tags.push({Key: 'AccountType', Value: accountProps.type});
    if (accountProps.stageName != null) tags.push({Key: 'StageName', Value: accountProps.stageName});
    if (accountProps.stageOrder != null) tags.push({Key: 'StageOrder', Value: accountProps.stageOrder.toString()});
    if (hostedServices != null) tags.push({Key: 'HostedServices', Value: hostedServices});
    const tagAccount = {
      service: "Organizations",
      action: "tagResource",
      region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
      physicalResourceId: cr.PhysicalResourceId.of(`tags-${accountId}`),
      parameters: {
        ResourceId: accountId,
        Tags: tags
      }
    };
    new cr.AwsCustomResource(this, "TagAccountCustomResource", {
      onCreate: tagAccount,
      onUpdate: tagAccount,
      onDelete: {
        service: "Organizations",
        action: "untagResource",
        region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
        parameters: {
          ResourceId: accountId,
          TagKeys: tags.map(t => t.Key)
        }
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      })
    });

    this.accountName = accountProps.name;
    this.accountId = accountId;
    this.accountStageName = accountProps.stageName;
    this.accountStageOrder = accountProps.stageOrder;

    let ssmParam = new ssm.StringParameter(this, existingAccount?`${accountId}-AccountDetails`:`${accountProps.name}-AccountDetails`, {
      description: `Details of ${accountProps.name}`,
      parameterName: `/accounts/${accountProps.name}`,
      simpleName: false,
      stringValue: JSON.stringify(accountProps),
    });
    ssmParam.node.addDependency(account);

    if (accountProps.parentOrganizationalUnitId) {
      let parent = new cr.AwsCustomResource(this, "ListParentsCustomResource", {
        onUpdate: {
          service: "Organizations",
          action: "listParents",
          physicalResourceId: cr.PhysicalResourceId.of(`${accountProps.parentOrganizationalUnitId}-${accountId}`),
          region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            ChildId: accountId,
          },
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      });

      new cr.AwsCustomResource(this, "MoveAccountCustomResource",
        {
          onUpdate: {
            service: "Organizations",
            action: "moveAccount",
            physicalResourceId: cr.PhysicalResourceId.of(`move-${accountId}`),
            region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
            parameters: {
              AccountId: accountId,
              DestinationParentId: accountProps.parentOrganizationalUnitId,
              SourceParentId: parent.getResponseField("Parents.0.Id"),
            },
            ignoreErrorCodesMatching: 'DuplicateAccountException' // ignore if account is already there
          },
          policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
            resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
          }),
        }
      );


      // Enabling Organizations listAccounts call for auto resolution of stages and DNS accounts Ids and Names
      if (accountProps.type === AccountType.CICD) {
        this.registerAsDelegatedAdministrator(accountId, 'ssm.amazonaws.com');
      } else {
       // Switching to another principal to workaround the max number of delegated administrators (which is set to 3 by default).
       const needsToBeDelegatedForDNSZOneNameResolution = this.node.tryGetContext('domain_name') ?? false;
       if(needsToBeDelegatedForDNSZOneNameResolution)
        this.registerAsDelegatedAdministrator(accountId, 'config-multiaccountsetup.amazonaws.com');
      }

    }
  }

  registerAsDelegatedAdministrator(accountId: string, servicePrincipal: string) {
    new cr.AwsCustomResource(this,
      "registerDelegatedAdministrator",
      {
        onCreate: {
          service: 'Organizations',
          action: 'registerDelegatedAdministrator', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#registerDelegatedAdministrator-property
          physicalResourceId: cr.PhysicalResourceId.of('registerDelegatedAdministrator'),
          region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            AccountId: accountId,
            ServicePrincipal: servicePrincipal
          }
        },
        onDelete: {
          service: 'Organizations',
          action: 'deregisterDelegatedAdministrator', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#deregisterDelegatedAdministrator-property
          physicalResourceId: cr.PhysicalResourceId.of('registerDelegatedAdministrator'),
          region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            AccountId: accountId,
            ServicePrincipal: servicePrincipal
          }
        },
        installLatestAwsSdk: false,
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls(
          {
            resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
          }
        )
      }
    );
  }
}
