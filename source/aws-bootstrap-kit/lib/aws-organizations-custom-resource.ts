import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import { Construct as CoreConstruct, CustomResource, Duration } from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';


/**
* A Custom Resource construct capable of importing and creating AWS Organizations.
* This construct uses the AWS CDK Custom Resources Provider Framework under the hood.
*/
export class AWSOrganizationsCustomResource extends CoreConstruct {

  /**
   * The Organization ID
   */
  public readonly OrganizationID: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const onEventHandler = new lambda.SingletonFunction(this, 'OnEventHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'organization-handler')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.onEventHandler',
      uuid: '0041F81C-A1F8-4F36-90AE-CD1564DC4392',
      lambdaPurpose: 'OrganizationProvider',
      timeout: Duration.minutes(1)
    });

    onEventHandler.addToRolePolicy(
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

    onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'iam:CreateServiceLinkedRole'
        ],
        resources: ['arn:aws:iam::*:role/aws-service-role/organizations.amazonaws.com/*'],
        conditions: { StringLike: { 'iam:AWSServiceName': 'organizations.amazonaws.com' } }
      }),
    );

    const provider = new Provider(this, 'OrganizationProvider', {
      onEventHandler: onEventHandler
    });

    let org = new CustomResource(
      this,
      `Resource`,
      {
        serviceToken: provider.serviceToken,
        resourceType: "Custom::AWS"
      }
    );

    this.OrganizationID = org.getAtt('OrganizationId').toString();

  }
}