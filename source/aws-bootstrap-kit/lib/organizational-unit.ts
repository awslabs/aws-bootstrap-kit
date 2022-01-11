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
import { OrganizationalUnitProvider } from './organizational-unit-provider';
import { CustomResource } from 'aws-cdk-lib';

export interface OrganizationalUnitProps {
    Name: string,
    ParentId: string
}

export class OrganizationalUnit extends Construct {

    readonly id: string;

    constructor(scope: Construct, id: string, props: OrganizationalUnitProps) {
        super(scope, id);

        const ouProvider = OrganizationalUnitProvider.getOrCreate(this);

        let ou = new CustomResource(this, `OU-${props.Name}`, {
          serviceToken: ouProvider.provider.serviceToken,
          resourceType: "Custom::OUCreation",
          properties: {
            Name: props.Name,
            ParentId: props.ParentId
          }
        });

        this.id = ou.getAtt("OrganizationalUnitId").toString();
    }
}