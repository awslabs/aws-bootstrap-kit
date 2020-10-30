import * as cdk from "@aws-cdk/core";
import * as cr from "@aws-cdk/custom-resources";
import {Organizations} from 'aws-sdk';

export const listAccounts = (construct: cdk.Construct): Organizations.Accounts => {
    const listAccounts = new cr.AwsCustomResource(construct, 
      "listAccounts", 
      {
        onCreate: {
          service: 'Organizations',
          physicalResourceId: cr.PhysicalResourceId.of('listAccounts'),
          action: 'listAccounts', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listAccounts-property
          region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
        },
        onUpdate: {
          service: 'Organizations',
          physicalResourceId: cr.PhysicalResourceId.of('listAccounts'),
          action: 'listAccounts', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listAccounts-property
          region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
        },
        onDelete: {
          service: 'Organizations',
          physicalResourceId: cr.PhysicalResourceId.of('listAccounts'),
          action: 'listAccounts', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listAccounts-property
          region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
        },
        installLatestAwsSdk: false,
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls(
          {
            resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
          }
        )
      }
    );
    return Array.isArray(listAccounts.getResponseField('Accounts'))?JSON.parse(listAccounts.getResponseField('Accounts')):[];

  }