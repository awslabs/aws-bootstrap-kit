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

import * as AWS from "aws-sdk";
import type {
  IsCompleteRequest,
  IsCompleteResponse,
  OnEventResponse
} from "@aws-cdk/custom-resources/lib/provider-framework/types";

AWS.config.update({ region: "us-east-1" });
const ses = new AWS.SES();

export async function onEventHandler(
  event: any
): Promise<OnEventResponse | void> {
  console.log("Event: %j", event);

  if (event.RequestType === "Create") {
    try {
      await ses
        .verifyEmailIdentity({ EmailAddress: event.ResourceProperties.email })
        .promise();

      return { PhysicalResourceId: "validateEmail" };
    } catch (error) {
      throw error;
    }
  }
}

export async function isCompleteHandler(
  event: IsCompleteRequest
): Promise<IsCompleteResponse | void> {
  console.log("Event: %j", event);

  if (!event.PhysicalResourceId) {
    throw new Error("Missing PhysicalResourceId parameter.");
  }

  const email = event.ResourceProperties.email;
  if (event.RequestType === "Create") {
    try {
      const response = await ses
        .getIdentityVerificationAttributes({
          Identities: [email]
        })
        .promise();

      return {
        IsComplete:
          response.VerificationAttributes[email]?.VerificationStatus ===
          "Success"
      };
    } catch (error) {
      throw error;
    }
  }
}
