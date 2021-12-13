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
  IsCompleteRequest,
  IsCompleteResponse,
  OnEventResponse,
} from "aws-cdk-lib/custom-resources/lib/provider-framework/types";

// eslint-disable-line import/no-extraneous-dependencies
import { Organizations } from "aws-sdk";


/**
 * A function capable of creating an account into an AWS Organisation
 * @param event An event with the following ResourceProperties: Email (coresponding to the account email) and AccountName (corresponding to the account name)
 * @returns Returns a PhysicalResourceId corresponding to the CreateAccount request's id necessary to check the status of the creation
 */

export async function onEventHandler(
  event: any
): Promise<OnEventResponse> {
  console.log("Event: %j", event);

  switch (event.RequestType) {
    case "Create":
      const awsOrganizationsClient = new Organizations({region: 'us-east-1'});
      try {
        const tags: { Key: string; Value: any; }[] = [];
        Object.keys(event.ResourceProperties).forEach( propertyKey => {
          if( propertyKey != 'ServiceToken' ) tags.push({Key: propertyKey, Value: event.ResourceProperties[propertyKey]});
        });
        const data = await awsOrganizationsClient
        .createAccount({
          Email: event.ResourceProperties.Email,
          AccountName: event.ResourceProperties.AccountName,
          Tags: tags
        })
        .promise();
        console.log("create account: %j", data);
        return { PhysicalResourceId: data.CreateAccountStatus?.Id };
      } catch (error) {
        throw new Error(`Failed to create account: ${error}`);
      }
    case "Update":
      return { PhysicalResourceId: event.PhysicalResourceId, ResourceProperties: event.ResourceProperties };
    default:
      throw new Error(`${event.RequestType} is not a supported operation`);
  }

}

/**
 * A function capable to check if an account creation request has been completed
 * @param event An event containing a PhysicalResourceId corresponding to a CreateAccountRequestId
 * @returns A payload containing the IsComplete Flag requested by cdk Custom Resource fwk to figure out if the resource has been created or failed to be or if it needs to retry
 */
export async function isCompleteHandler(
  event: IsCompleteRequest
): Promise<IsCompleteResponse> {
  console.log("Event: %j", event);

  if(!event.PhysicalResourceId) {
    throw new Error("Missing PhysicalResourceId parameter.");
  }

  const awsOrganizationsClient = new Organizations({region: 'us-east-1'});

  const describeCreateAccountStatusParams : Organizations.DescribeCreateAccountStatusRequest = {CreateAccountRequestId: event.PhysicalResourceId}
  const data: Organizations.DescribeCreateAccountStatusResponse  = await awsOrganizationsClient
    .describeCreateAccountStatus(describeCreateAccountStatusParams).promise();

  console.log("Describe account: %j", data);

  const CreateAccountStatus = data.CreateAccountStatus?.State;
  const AccountId = data.CreateAccountStatus?.AccountId;

  switch (event.RequestType) {
    case "Create":
      if (CreateAccountStatus === "FAILED") {
        throw new Error(`Error creating the account ${data.CreateAccountStatus?.AccountName}, cause: ${data.CreateAccountStatus?.FailureReason}`)
      }
      return { IsComplete: CreateAccountStatus === "SUCCEEDED", Data: {AccountId: AccountId} };
    case "Update":
      if(AccountId) {
        console.log(`Add tags: type = ${event.ResourceProperties.AccountType}`);
        const tags: { Key: string; Value: any; }[] = [];
        Object.keys(event.ResourceProperties).forEach( propertyKey => {
          if( propertyKey != 'ServiceToken' ) tags.push({Key: propertyKey, Value: event.ResourceProperties[propertyKey]});
        });
        const tagsUpdateRequestData = await awsOrganizationsClient
        .tagResource({
          ResourceId: AccountId!,
          Tags: tags
        })
        .promise();
        console.log("Updated account tags: %j", tagsUpdateRequestData);
      }
        return { IsComplete: CreateAccountStatus === "SUCCEEDED", Data: {AccountId: AccountId} };
    case "Delete":
      // TODO: figure out what to do here
      throw new Error("DeleteAccount is not a supported operation");
  }
}
