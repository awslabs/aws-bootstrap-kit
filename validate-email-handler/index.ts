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

import { SES, config } from "aws-sdk";
import type {
  IsCompleteRequest,
  IsCompleteResponse,
  OnEventResponse
} from "@aws-cdk/custom-resources/lib/provider-framework/types";

config.update({ region: "us-east-1" });

/**
 * A function that send a verification email
 * @param event An event with the following ResourceProperties: email (coresponding to the root email)
 * @returns Returns a PhysicalResourceId
 */
export async function onEventHandler(
  event: any
): Promise<OnEventResponse | void> {
  console.log("Event: %j", event);

  if (event.RequestType === "Create") {
    const ses = new SES();
    await ses
      .verifyEmailIdentity({ EmailAddress: event.ResourceProperties.email })
      .promise();

    return { PhysicalResourceId: 'validateEmail' };
  }

  if (event.RequestType === "Delete") {
    return { PhysicalResourceId: event.PhysicalResourceId };
  }
}

/**
 * A function that checks email has been verified
 * @param event An event with the following ResourceProperties: email (coresponding to the root email)
 * @returns A payload containing the IsComplete Flag requested by cdk Custom Resource to figure out if the email has been verified and if not retries later
 */
export async function isCompleteHandler(
  event: IsCompleteRequest
): Promise<IsCompleteResponse | void> {
  console.log("Event: %j", event);

  if (!event.PhysicalResourceId) {
    throw new Error("Missing PhysicalResourceId parameter.");
  }

  const email = event.ResourceProperties.email;
  if (event.RequestType === "Create") {
    const ses = new SES();
    const response = await ses
      .getIdentityVerificationAttributes({
        Identities: [email]
      })
      .promise();

    return {
      IsComplete:
        response.VerificationAttributes[email]?.VerificationStatus === "Success"
    };
  }
  if (event.RequestType === "Delete") {
    return { IsComplete: true };
  }
}
