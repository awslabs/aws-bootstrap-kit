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

import "@aws-cdk/assert/jest";
import {
  OnEventRequest,
  IsCompleteRequest
} from "aws-cdk-lib/custom-resources/lib/provider-framework/types";
import * as AWS from "aws-sdk-mock";
import * as sinon from "sinon";
import {
  isCompleteHandler,
  onEventHandler
} from "../lib/validate-email-handler";
import { Stack } from "aws-cdk-lib/core";
import { ValidateEmail } from "../lib/validate-email";

test("Should throw Error if Email Prefix contains + ", () => {
  const validateEmailStack = () =>
    new ValidateEmail(new Stack(), "TestStack", {
      email: "test+test@test.com"
    });

  expect(validateEmailStack).toThrowError(
    "Root Email should be without + in it"
  );
});

AWS.setSDK(require.resolve("aws-sdk"));

const createEvent: OnEventRequest = {
  RequestType: "Create",
  ServiceToken: "fakeToken",
  ResponseURL: "fakeUrl",
  StackId: "fakeStackId",
  RequestId: "fakeReqId",
  LogicalResourceId: "fakeLogicalId",
  ResourceType: "Custom::EmailValidation",
  ResourceProperties: {
    ServiceToken: "fakeToken",
    email: "test@test.com"
  }
};

const isCompleteCreateEvent: IsCompleteRequest = {
  RequestType: "Create",
  ServiceToken: "fakeToken",
  ResponseURL: "fakeUrl",
  StackId: "fakeStackId",
  RequestId: "fakeReqId",
  LogicalResourceId: "fakeLogicalId",
  ResourceType: "Custom::EmailValidation",
  ResourceProperties: {
    ServiceToken: "fakeToken",
    Email: "test@test.com"
  },
  PhysicalResourceId: "fakeRequestCreateAccountStatusId"
};

const deleteEvent = { ...createEvent, RequestType: 'Delete', PhysicalResourceId: 'validateEmail' }
const isCompleteDeleteEvent: IsCompleteRequest = { ...isCompleteCreateEvent, RequestType: 'Delete' }

afterEach(() => {
  AWS.restore();
});

test("on event create calls ses verifyEmailIdentity", async () => {
  const verifyEmailIdentityMock = sinon.fake.resolves(true);

  AWS.mock("SES", "verifyEmailIdentity", verifyEmailIdentityMock);

  const data = await onEventHandler(createEvent);

  sinon.assert.calledWith(verifyEmailIdentityMock, {
    EmailAddress: "test@test.com"
  });

  expect(data).toEqual({
    PhysicalResourceId: "validateEmail"
  });
});

test("on completion event calls ses getIdentityVerificationAttributes", async () => {
  const verifyEmailIdentityMock = sinon.fake.resolves(true);
  AWS.mock("SES", "verifyEmailIdentity", verifyEmailIdentityMock);

  const data = await onEventHandler(createEvent);

  sinon.assert.calledWith(verifyEmailIdentityMock, {
    EmailAddress: "test@test.com"
  });

  expect(data).toEqual({
    PhysicalResourceId: "validateEmail"
  });
});

test("on event does not call verifyEmailIdentity for Update requests", async () => {
  const verifyEmailIdentityMock = sinon.fake.resolves(true);
  AWS.mock("SES", "verifyEmailIdentity", verifyEmailIdentityMock);

  await onEventHandler({
    ...createEvent,
    RequestType: "Update"
  });
  sinon.assert.notCalled(verifyEmailIdentityMock);
});

test("is complete will throw error without requestId", async () => {
  const getIdentityVerificationMock = sinon.fake.resolves(true);

  AWS.mock(
    "SES",
    "getIdentityVerificationAttributes",
    getIdentityVerificationMock
  );

  try {
    await isCompleteHandler({
      ...isCompleteCreateEvent,
      PhysicalResourceId: undefined
    });
    sinon.assert.fail();
  } catch (error) {
    sinon.assert.notCalled(getIdentityVerificationMock);
    expect(error.message).toEqual("Missing PhysicalResourceId parameter.");
  }
});

test("is complete for create returns false when email is not verified yet", async () => {
  const getIdentityVerificationMock = sinon.fake.resolves({
    VerificationAttributes: {
      "test@test.com": { VerificationStatus: "Progress" }
    }
  });

  AWS.mock(
    "SES",
    "getIdentityVerificationAttributes",
    getIdentityVerificationMock
  );

  const data: any = await isCompleteHandler(isCompleteCreateEvent);

  expect(data.IsComplete).toBeFalsy;
});

test("is complete for create returns true when email is verified", async () => {
  const getIdentityVerificationMock = sinon.fake.resolves({
    VerificationAttributes: {
      "test@test.com": { VerificationStatus: "Success" }
    }
  });

  AWS.mock(
    "SES",
    "getIdentityVerificationAttributes",
    getIdentityVerificationMock
  );

  const data: any = await isCompleteHandler(isCompleteCreateEvent);

  expect(data.IsComplete).toBeTruthy;
});


test("on event delete no calls ses verifyEmailIdentity", async () => {
  const verifyEmailIdentityMock = sinon.fake.resolves(true);

  AWS.mock("SES", "verifyEmailIdentity", verifyEmailIdentityMock);

  const data = await onEventHandler(deleteEvent);

  sinon.assert.notCalled(verifyEmailIdentityMock);

  expect(data).toEqual({
    PhysicalResourceId: "validateEmail"
  });
});

test("is complete for delete returns true when email is verified", async () => {

  const data: any = await isCompleteHandler(isCompleteDeleteEvent);

  expect(data.IsComplete).toBeTruthy;
});