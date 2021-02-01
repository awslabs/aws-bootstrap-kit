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
import { AccountType } from "../lib";
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
    AccountType: AccountType.STAGE,
    StageName: "stage1",
    StageOrder: "1",
    HostedServices: "app1:app2:app3"
  },
};


const isCompleteCreateEvent: IsCompleteRequest = {
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

const updateEvent: OnEventRequest = { 
  ... createEvent, 
  RequestType: "Update",   
  PhysicalResourceId: "fakeRequestCreateAccountStatusId" 
}
const isCompleteUpdateEvent: IsCompleteRequest = { 
  ... isCompleteCreateEvent, 
  RequestType: "Update", 
  ResourceProperties: {
    ServiceToken:  updateEvent.ResourceProperties.ServiceToken, 
    AccountType: updateEvent.ResourceProperties.AccountType,
    StageName: updateEvent.ResourceProperties.StageName,
    StageOrder: updateEvent.ResourceProperties.StageOrder,
    HostedServices: updateEvent.ResourceProperties.HostedServices
  } 
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
    Tags: [
      { 
        Key: "Email", 
        Value: "fakeAlias+fakeStage@amazon.com" 
      }, 
      { 
        Key: "AccountName", 
        Value: "Workload-fakeStage" 
      },
      {
        Key: 'AccountType',
        Value: createEvent.ResourceProperties.AccountType
      },
      {
        Key: 'StageName',
        Value: createEvent.ResourceProperties.StageName
      },
      {
        Key: 'StageOrder',
        Value: createEvent.ResourceProperties.StageOrder.toString()
      },
      {
        Key: 'HostedServices',
        Value: createEvent.ResourceProperties.HostedServices
      }
    ],
  });

  expect(data).toEqual({
    PhysicalResourceId: createAccountRequestId,
  });
});

test("on update event does not call createAccount for Update requests but forward properties to isCompleteHandler for tag updates", async () => {
  const createAccountMock = sinon.fake.resolves({});

  AWS.mock("Organizations", "createAccount", createAccountMock);

  const data = await onEventHandler(updateEvent);
    sinon.assert.notCalled(createAccountMock);
    expect(data).toEqual({
      PhysicalResourceId: updateEvent.PhysicalResourceId,
      ResourceProperties: updateEvent.ResourceProperties
    });
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

  const data = await isCompleteHandler(isCompleteCreateEvent);

  expect(data.IsComplete).toBeFalsy;
});

test("is complete for create returns true when account creation is complete", async () => {
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

  const data = await isCompleteHandler(isCompleteCreateEvent);

  expect(data.IsComplete).toBeTruthy;
  expect(data.Data?.AccountId).toEqual("fakeAccountId");
});

test("is complete for update updates tags of the account", async () => {
  const describeCreateAccountStatusMock = sinon.fake.resolves({
    CreateAccountStatus: {
        State: "SUCCEEDED",
        AccountId: "fakeAccountId"
    }
  });
  const tagResourceMock = sinon.fake.resolves({});

  AWS.mock(
    "Organizations",
    "describeCreateAccountStatus",
    describeCreateAccountStatusMock
  );

  AWS.mock(
    "Organizations",
    "tagResource",
    tagResourceMock
  );

  const data = await isCompleteHandler(isCompleteUpdateEvent);

  expect(data.IsComplete).toBeTruthy;
  expect(data.Data?.AccountId).toEqual("fakeAccountId");

  sinon.assert.calledWith(tagResourceMock, {
    ResourceId: "fakeAccountId",
    Tags: [
      {
        Key: 'AccountType',
        Value: createEvent.ResourceProperties.AccountType
      },
      {
        Key: 'StageName',
        Value: createEvent.ResourceProperties.StageName
      },
      {
        Key: 'StageOrder',
        Value: createEvent.ResourceProperties.StageOrder.toString()
      },
      {
        Key: 'HostedServices',
        Value: createEvent.ResourceProperties.HostedServices
      }
    ],
  });
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
      ...isCompleteCreateEvent,
      RequestType: "Delete",
    });
  } catch (error) {
    expect(error.message).toEqual("DeleteAccount is not a supported operation");
  }
});
