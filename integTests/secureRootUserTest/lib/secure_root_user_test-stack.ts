import * as cdk from '@aws-cdk/core';
import * as awsBootstrapKit from 'aws-bootstrap-kit';

export class SecureRootUserTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new awsBootstrapKit.SecureRootUser(this, 'secureRootUserConfigSetup', '<YOUR EMAIL>');
  }
}
