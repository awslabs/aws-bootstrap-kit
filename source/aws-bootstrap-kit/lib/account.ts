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

import * as core from "@aws-cdk/core";
import { AccountProvider } from "./account-provider";
import * as cr from "@aws-cdk/custom-resources";
import * as ssm from "@aws-cdk/aws-ssm"; 

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

}

/**
 * An AWS Account
 */
export class Account extends core.Construct {
  /**
   * Constructor
   * 
   * @param scope The parent Construct instantiating this account
   * @param id This instance name
   * @param accountProps Account properties
   */
  readonly accountName: string;
  readonly accountId: string;

  constructor(scope: core.Construct, id: string, accountProps: IAccountProps) {
    super(scope, id);

    const accountProvider = AccountProvider.getOrCreate(this);

    let account = new core.CustomResource(
      this,
      `Account-${accountProps.name}`,
      {
        serviceToken: accountProvider.provider.serviceToken,
        resourceType: "Custom::AccountCreation",
        properties: {
          Email: accountProps.email,
          AccountName: accountProps.name,
        },
      }
    );

    let accountId = account.getAtt("AccountId").toString();
    
    accountProps.id = accountId;
    this.accountName = accountProps.name;
    this.accountId = accountId;

    new ssm.StringParameter(this, `${accountProps.name}-AccountDetails`, {
      description: `Details of ${accountProps.name}`,
      parameterName: `/accounts/${accountProps.name}`,
      stringValue: JSON.stringify(accountProps),
    });
    
    if (accountProps.parentOrganizationalUnitId) {
      let parent = new cr.AwsCustomResource(this, "ListParentsCustomResource", {
        onCreate: {
          service: "Organizations",
          action: "listParents",
          physicalResourceId: cr.PhysicalResourceId.fromResponse(
            "Parents.0.Id"
          ),
          region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            ChildId: accountId,
          },
        },
        onUpdate: {
          service: "Organizations",
          action: "listParents",
          physicalResourceId: cr.PhysicalResourceId.fromResponse(
            "Parents.0.Id"
          ),
          region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            ChildId: accountId,
          },
        },
        onDelete: {
          service: "Organizations",
          action: "listParents",
          physicalResourceId: cr.PhysicalResourceId.fromResponse(
            "Parents.0.Id"
          ),
          region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
          parameters: {
            ChildId: accountId,
          },
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      });

      new cr.AwsCustomResource(
        this,
        "MoveAccountCustomResource",
        {
          onCreate: {
            service: "Organizations",
            action: "moveAccount",
            physicalResourceId: cr.PhysicalResourceId.of(accountId),
            region: "us-east-1", //AWS Organizations API are only available in us-east-1 for root actions
            parameters: {
              AccountId: accountId,
              DestinationParentId: accountProps.parentOrganizationalUnitId,
              SourceParentId: parent.getResponseField("Parents.0.Id"),
            },
          },
          policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
            resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
          }),
        }
      );

      // Enabling Organizations listAccounts call for auto resolution of stages and DNS accounts Ids and Names
      if (accountProps.name === 'CICD') {
        this.registerAsDelegatedAdministrator(accountId, 'ssm.amazonaws.com');
      } else {
       // Switching to another principal to workaround the max number of delegated administrators (which is set to 3 by default).
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
