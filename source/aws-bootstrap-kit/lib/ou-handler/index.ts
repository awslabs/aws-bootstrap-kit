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

/* eslint-disable no-console */
import type {
    OnEventResponse,
} from "aws-cdk-lib/custom-resources/lib/provider-framework/types";

  // eslint-disable-line import/no-extraneous-dependencies
  import { Organizations } from "aws-sdk";
  import { OrganizationalUnit, ListOrganizationalUnitsForParentResponse, ListOrganizationalUnitsForParentRequest } from "aws-sdk/clients/organizations";

  /**
   * A function capable of creating an Organisational Unit if not already created
   * @param event An event with OU name and parentId in ResourceProperties
   * @returns Returns a PhysicalResourceId corresponding to the Organisational Unit id
   */
   export async function onEventHandler(
    event: any
  ): Promise<OnEventResponse> {
    console.log("Event: %j", event);
    const awsOrganizationsClient = new Organizations({region: 'us-east-1'});

    switch (event.RequestType) {
      case "Create":
        let OU = await searchOrganizationalUnit(awsOrganizationsClient, event.ResourceProperties.ParentId, event.ResourceProperties.Name);
        let existingOU = (OU != null);

        if (!existingOU) {
          console.log(`creating OU ${event.ResourceProperties.Name} under ${event.ResourceProperties.ParentId}`);
          let response = await awsOrganizationsClient.createOrganizationalUnit({
            ParentId: event.ResourceProperties.ParentId,
            Name: event.ResourceProperties.Name
          }).promise();
          OU = response.OrganizationalUnit;
        }

        return { PhysicalResourceId: OU?.Id, Data: { OrganizationalUnitId: OU?.Id, ExistingOU: existingOU } };

      case "Update":
        await awsOrganizationsClient.updateOrganizationalUnit({
          OrganizationalUnitId: event.PhysicalResourceId,
          Name: event.ResourceProperties.Name
        }).promise();

        return { PhysicalResourceId: event.PhysicalResourceId, Data: { OrganizationalUnitId: event.PhysicalResourceId } };
      default:
        // we cannot delete the OU as we don't delete accounts within the OU
        return { PhysicalResourceId: event.PhysicalResourceId, Data: { OrganizationalUnitId: event.PhysicalResourceId } };
    }

  }

  async function searchOrganizationalUnit(awsOrganizationsClient:Organizations, parentId:string, name:string): Promise<OrganizationalUnit | undefined> {
    let response:ListOrganizationalUnitsForParentResponse = {};
    let params:ListOrganizationalUnitsForParentRequest = {
      ParentId: parentId
    }

    response = await awsOrganizationsClient.listOrganizationalUnitsForParent(params).promise();
    let OU = response.OrganizationalUnits?.find(ou => ou.Name === name);
    if (OU) { return OU; }

    while (response.NextToken) {
      params.NextToken = response.NextToken;
      response = await awsOrganizationsClient.listOrganizationalUnitsForParent(params).promise();
      let OU = response.OrganizationalUnits?.find(ou => ou.Name === name);
      if (OU) { return OU; }
    }

    return undefined;
  }
