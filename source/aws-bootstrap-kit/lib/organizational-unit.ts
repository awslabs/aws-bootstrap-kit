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

import * as core from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';

export interface OrganizationalUnitProps {
    Name: string,
    ParentId: string
}

export class OrganizationalUnit extends core.Construct {

    readonly id: string;

    constructor(scope: core.Construct, id: string, props: OrganizationalUnitProps) {
        super(scope, id);

        
          let ou = new cr.AwsCustomResource(this, 
            "OUCustomResource", 
            {
              onCreate: {
                service: 'Organizations',
                action: 'createOrganizationalUnit',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('OrganizationalUnit.Id'),
                region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
                parameters:
                  {
                    Name: props.Name,
                    ParentId: props.ParentId
                  }
              },
              onUpdate: {
                service: 'Organizations',
                action: 'updateOrganizationalUnit',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('OrganizationalUnit.Id'),
                region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
                parameters:
                  {
                    Name: props.Name,
                    OrganizationalUnitId: new cr.PhysicalResourceIdReference()
                  }
              },
              onDelete: {
                service: 'Organizations',
                action: 'deleteOrganizationalUnit',
                region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
                parameters:
                  {
                    Name: props.Name,
                    OrganizationalUnitId: new cr.PhysicalResourceIdReference()
                  }
              },
              installLatestAwsSdk: false,
              policy: cr.AwsCustomResourcePolicy.fromSdkCalls(
                {
                  resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
                }
              )
            },
          );

        this.id = ou.getResponseField("OrganizationalUnit.Id");
    }
}