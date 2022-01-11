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

  /**
   * A function capable of creating an Organisation if not already created
   * @param event An event with no ResourceProperties
   * @returns Returns a PhysicalResourceId corresponding to the Organization id (no need to wait and check for completion)
   */
   export async function onEventHandler(
    event: any
  ): Promise<OnEventResponse> {
    console.log("Event: %j", event);

    const awsOrganizationsClient = new Organizations({region: 'us-east-1'});

    switch (event.RequestType) {
      case "Create":
        let result;
        let existingOrg = false;
        try {
            result = await awsOrganizationsClient
                            .describeOrganization()
                            .promise();

            existingOrg = true;
            console.log("existing organization: %j", result);
        } catch (error) {
            if (error.code === 'AWSOrganizationsNotInUseException') {
                result = await awsOrganizationsClient
                            .createOrganization()
                            .promise();

                console.log("created organization: %j", result);
            } else {
                throw error;
            }
        }
        return { PhysicalResourceId: result.Organization?.Id, Data: { OrganizationId: result.Organization?.Id, ExistingOrg: existingOrg } };
      default:
        // we don't delete the org, just the custom resource
        return { PhysicalResourceId: event.PhysicalResourceId, Data: { OrganizationId: event.PhysicalResourceId } };
    }

  }
