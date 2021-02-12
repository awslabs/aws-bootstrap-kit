import * as cdk from '@aws-cdk/core';
import { Organization } from 'aws-bootstrap-kit';

export class OrganizationConstructTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    let org = new Organization(this, "organization");
  }
}
