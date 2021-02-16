import { Construct } from 'constructs';

import { Construct as CoreConstruct, CustomResource } from '@aws-cdk/core';
import { AWSOrganizationProvider } from './organization-provider';


export class AWSOrganizationsCustomResource extends CoreConstruct {

  public readonly OrganizationID: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const organizationProvider = AWSOrganizationProvider.getOrCreate(this);

    let org = new CustomResource(
      this,
      `Resource`,
      {
        serviceToken: organizationProvider.provider.serviceToken,
        resourceType: "Custom::AWS",
        properties: {
        },
      }
    );

    this.OrganizationID = org.getAtt('OrganizationId').toString();

  }
}