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
} from "@aws-cdk/custom-resources/lib/provider-framework/types";

// eslint-disable-line import/no-extraneous-dependencies
import { Organizations } from "aws-sdk";

const awsOrganizationsClient = new Organizations({ region: 'us-east-1' });

/**
 * A function capable of creating or importing an AWS Organisation
 * @param event An event with the following no ResourceProperties: Email (coresponding to the account email) and AccountName (corresponding to the account name)
 * @returns Returns a PhysicalResourceId corresponding to the CreateAccount request's id necessary to check the status of the creation
 */

export async function onEventHandler(
  event: any
): Promise<OnEventResponse> {
  console.log("Event: %j", event);

  switch (event.RequestType) {
    case "Create":
      try {
        const data = await awsOrganizationsClient.describeOrganization().promise();

        if (data.Organization?.FeatureSet === 'CONSOLIDATED_BILLING') {
          throw new Error(`The organization with ID ${data.Organization?.Id} has not all features enabled. It can't be imported by the organization construct.`);
        }

        return { PhysicalResourceId: data.Organization?.Id };
      } catch (err) {
        switch (err.code) {
          case 'AWSOrganizationsNotInUseException':
            return { PhysicalResourceId: await createOrganization() };;
            break;
          default:
            throw new Error(`Failed to describe the organization: ${err}`);
        }
      }
    case "Update":
      return { PhysicalResourceId: event.PhysicalResourceId, ResourceProperties: event.ResourceProperties };
    case "Delete":
      const listAccountsResponse = await awsOrganizationsClient.listAccounts({ MaxResults: 1 }).promise();
      if (listAccountsResponse.Accounts?.length === 1) {
        await awsOrganizationsClient.deleteOrganization().promise();
      }
      else {
        console.log(`Organization ${event.PhysicalResourceId} is not empty so the resource will be retained`);
      }
      return { PhysicalResourceId: event.PhysicalResourceId };
    default:
      throw new Error(`${event.RequestType} is not a supported operation`);
  }

}

async function createOrganization(): Promise<string | undefined> {
  try {
    const data = await awsOrganizationsClient.createOrganization({}).promise();
    console.log("create organization: %j", data);
    return data.Organization?.Id;
  } catch (error) {
    throw new Error(`Failed to create organization: ${error}`);
  }
}

