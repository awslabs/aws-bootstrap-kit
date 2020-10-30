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

import { OnEventRequest, IsCompleteRequest } from "@aws-cdk/custom-resources/lib/provider-framework/types";
import * as AWS from "aws-sdk-mock";
import * as sinon from "sinon";
import { isCompleteHandler, onEventHandler } from "../lib/account-handler";

AWS.setSDK(require.resolve("aws-sdk"));

const createEvent: OnEventRequest = {
  RequestType: "Create",
  ServiceToken: "fakeToken",
  ResponseURL: "fakeUrl",
  StackId: "fakeStackId",
  RequestId: "fakeReqId",
  LogicalResourceId: "fakeLogicalId",
  ResourceType: "Custom::AccountCreation",
  ResourceProperties: {
    ServiceToken: "fakeToken",
    Email: "fakeAlias+fakeStage@amazon.com",
    AccountName: "Workload-fakeStage",
  },
};


const isCompleteEvent: IsCompleteRequest = {
  RequestType: "Create",
  ServiceToken: "fakeToken",
  ResponseURL: "fakeUrl",
  StackId: "fakeStackId",
  RequestId: "fakeReqId",
  LogicalResourceId: "fakeLogicalId",
  ResourceType: "Custom::AccountCreation",
  ResourceProperties: {
    ServiceToken: "fakeToken",
  },
  PhysicalResourceId: "fakeRequestCreateAccountStatusId"
}
afterEach(() => {
  AWS.restore();
});

test("on event creates account for Create requests", async () => {
  const createAccountRequestId = "fakeReqId";
  const createAccountMock = sinon.fake.resolves({
    CreateAccountStatus: { Id: createAccountRequestId },
  });

  AWS.mock("Organizations", "createAccount", createAccountMock);

  const data = await onEventHandler(createEvent);

  sinon.assert.calledWith(createAccountMock, {
    Email: "fakeAlias+fakeStage@amazon.com",
    AccountName: "Workload-fakeStage",
  });

  expect(data).toEqual({
    PhysicalResourceId: createAccountRequestId,
  });
});

test("on event does not call createAccount for Update requests", async () => {
  const createAccountMock = sinon.fake.resolves({});

  AWS.mock("Organizations", "createAccount", createAccountMock);

  try {
    await onEventHandler({
      ...createEvent,
      RequestType: "Update",
    });
  } catch (error) {
    sinon.assert.notCalled(createAccountMock);
    expect(error.message).toEqual("UpdateAccount is not a supported operation");
  }
});

test("is complete for create throw without requestId", async () => {
  const describeCreateAccountStatusMock = sinon.fake.resolves({});

  AWS.mock(
    "Organizations",
    "describeCreateAccountStatus",
    describeCreateAccountStatusMock
  );

  try {
    await isCompleteHandler({
      RequestType: "Create",
      ServiceToken: "fakeToken",
      ResponseURL: "fakeUrl",
      StackId: "fakeStackId",
      RequestId: "fakeReqId",
      LogicalResourceId: "fakeLogicalId",
      ResourceType: "Custom::AccountCreation",
      ResourceProperties: {
        ServiceToken: "fakeToken",
      },
      PhysicalResourceId: undefined
    });
    sinon.assert.fail();
  }  catch (error) {
    sinon.assert.notCalled(describeCreateAccountStatusMock);
    expect(error.message).toEqual("Missing PhysicalResourceId parameter.");
  }
});

test("is complete for create returns false when account creation is in progress", async () => {
  const describeCreateAccountStatusMock = sinon.fake.resolves({
    CreateAccountStatus: "INPROGRESS",
  });

  AWS.mock(
    "Organizations",
    "describeCreateAccountStatus",
    describeCreateAccountStatusMock
  );

  const data = await isCompleteHandler(isCompleteEvent);

  expect(data.IsComplete).toBeFalsy;
});

test("is complete for create returns false when account creation is complete", async () => {
  const describeCreateAccountStatusMock = sinon.fake.resolves({
    CreateAccountStatus: {
        State: "SUCCEEDED",
        AccountId: "fakeAccountId"
    }
  });

  AWS.mock(
    "Organizations",
    "describeCreateAccountStatus",
    describeCreateAccountStatusMock
  );

  const data = await isCompleteHandler(isCompleteEvent);

  expect(data.IsComplete).toBeTruthy;
  expect(data.Data?.AccountId).toEqual("fakeAccountId");
});

test("is complete for delete  throws", async () => {
  const describeCreateAccountStatusMock = sinon.fake.resolves({});

  AWS.mock(
    "Organizations",
    "describeCreateAccountStatus",
    describeCreateAccountStatusMock
  );

  try {
    await isCompleteHandler({
      ...isCompleteEvent,
      RequestType: "Delete",
    });
  } catch (error) {
    expect(error.message).toEqual("DeleteAccount is not a supported operation");
  }
});
