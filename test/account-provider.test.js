"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk-mock");
const sinon = require("sinon");
const lib_1 = require("../lib");
const account_handler_1 = require("../lib/account-handler");
AWS.setSDK(require.resolve("aws-sdk"));
const createEvent = {
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
        AccountType: lib_1.AccountType.STAGE,
        StageName: "stage1",
        StageOrder: "1",
        HostedServices: "app1:app2:app3"
    },
};
const isCompleteCreateEvent = {
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
};
const updateEvent = {
    ...createEvent,
    RequestType: "Update",
    PhysicalResourceId: "fakeRequestCreateAccountStatusId"
};
const isCompleteUpdateEvent = {
    ...isCompleteCreateEvent,
    RequestType: "Update",
    ResourceProperties: {
        ServiceToken: updateEvent.ResourceProperties.ServiceToken,
        AccountType: updateEvent.ResourceProperties.AccountType,
        StageName: updateEvent.ResourceProperties.StageName,
        StageOrder: updateEvent.ResourceProperties.StageOrder,
        HostedServices: updateEvent.ResourceProperties.HostedServices
    }
};
afterEach(() => {
    AWS.restore();
});
test("on event creates account for Create requests", async () => {
    const createAccountRequestId = "fakeReqId";
    const createAccountMock = sinon.fake.resolves({
        CreateAccountStatus: { Id: createAccountRequestId },
    });
    AWS.mock("Organizations", "createAccount", createAccountMock);
    const data = await account_handler_1.onEventHandler(createEvent);
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
    const data = await account_handler_1.onEventHandler(updateEvent);
    sinon.assert.notCalled(createAccountMock);
    expect(data).toEqual({
        PhysicalResourceId: updateEvent.PhysicalResourceId,
        ResourceProperties: updateEvent.ResourceProperties
    });
});
test("is complete for create throw without requestId", async () => {
    const describeCreateAccountStatusMock = sinon.fake.resolves({});
    AWS.mock("Organizations", "describeCreateAccountStatus", describeCreateAccountStatusMock);
    try {
        await account_handler_1.isCompleteHandler({
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
    }
    catch (error) {
        sinon.assert.notCalled(describeCreateAccountStatusMock);
        expect(error.message).toEqual("Missing PhysicalResourceId parameter.");
    }
});
test("is complete for create returns false when account creation is in progress", async () => {
    const describeCreateAccountStatusMock = sinon.fake.resolves({
        CreateAccountStatus: "INPROGRESS",
    });
    AWS.mock("Organizations", "describeCreateAccountStatus", describeCreateAccountStatusMock);
    const data = await account_handler_1.isCompleteHandler(isCompleteCreateEvent);
    expect(data.IsComplete).toBeFalsy;
});
test("is complete for create returns true when account creation is complete", async () => {
    var _a;
    const describeCreateAccountStatusMock = sinon.fake.resolves({
        CreateAccountStatus: {
            State: "SUCCEEDED",
            AccountId: "fakeAccountId"
        }
    });
    AWS.mock("Organizations", "describeCreateAccountStatus", describeCreateAccountStatusMock);
    const data = await account_handler_1.isCompleteHandler(isCompleteCreateEvent);
    expect(data.IsComplete).toBeTruthy;
    expect((_a = data.Data) === null || _a === void 0 ? void 0 : _a.AccountId).toEqual("fakeAccountId");
});
test("is complete for update updates tags of the account", async () => {
    var _a;
    const describeCreateAccountStatusMock = sinon.fake.resolves({
        CreateAccountStatus: {
            State: "SUCCEEDED",
            AccountId: "fakeAccountId"
        }
    });
    const tagResourceMock = sinon.fake.resolves({});
    AWS.mock("Organizations", "describeCreateAccountStatus", describeCreateAccountStatusMock);
    AWS.mock("Organizations", "tagResource", tagResourceMock);
    const data = await account_handler_1.isCompleteHandler(isCompleteUpdateEvent);
    expect(data.IsComplete).toBeTruthy;
    expect((_a = data.Data) === null || _a === void 0 ? void 0 : _a.AccountId).toEqual("fakeAccountId");
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
    AWS.mock("Organizations", "describeCreateAccountStatus", describeCreateAccountStatusMock);
    try {
        await account_handler_1.isCompleteHandler({
            ...isCompleteCreateEvent,
            RequestType: "Delete",
        });
    }
    catch (error) {
        expect(error.message).toEqual("DeleteAccount is not a supported operation");
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWNjb3VudC1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7QUFHRixvQ0FBb0M7QUFDcEMsK0JBQStCO0FBQy9CLGdDQUFxQztBQUNyQyw0REFBMkU7QUFFM0UsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFFdkMsTUFBTSxXQUFXLEdBQW1CO0lBQ2xDLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLFlBQVksRUFBRSxXQUFXO0lBQ3pCLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLGlCQUFpQixFQUFFLGVBQWU7SUFDbEMsWUFBWSxFQUFFLHlCQUF5QjtJQUN2QyxrQkFBa0IsRUFBRTtRQUNsQixZQUFZLEVBQUUsV0FBVztRQUN6QixLQUFLLEVBQUUsZ0NBQWdDO1FBQ3ZDLFdBQVcsRUFBRSxvQkFBb0I7UUFDakMsV0FBVyxFQUFFLGlCQUFXLENBQUMsS0FBSztRQUM5QixTQUFTLEVBQUUsUUFBUTtRQUNuQixVQUFVLEVBQUUsR0FBRztRQUNmLGNBQWMsRUFBRSxnQkFBZ0I7S0FDakM7Q0FDRixDQUFDO0FBR0YsTUFBTSxxQkFBcUIsR0FBc0I7SUFDL0MsV0FBVyxFQUFFLFFBQVE7SUFDckIsWUFBWSxFQUFFLFdBQVc7SUFDekIsV0FBVyxFQUFFLFNBQVM7SUFDdEIsT0FBTyxFQUFFLGFBQWE7SUFDdEIsU0FBUyxFQUFFLFdBQVc7SUFDdEIsaUJBQWlCLEVBQUUsZUFBZTtJQUNsQyxZQUFZLEVBQUUseUJBQXlCO0lBQ3ZDLGtCQUFrQixFQUFFO1FBQ2xCLFlBQVksRUFBRSxXQUFXO0tBQzFCO0lBQ0Qsa0JBQWtCLEVBQUUsa0NBQWtDO0NBQ3ZELENBQUE7QUFFRCxNQUFN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LEdBQUcscUJBQXFCO1lBQ3hCLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUMsQ0FBQztLQUNKO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0tBQzdFO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIFxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgeyBPbkV2ZW50UmVxdWVzdCwgSXNDb21wbGV0ZVJlcXVlc3QgfSBmcm9tIFwiQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzXCI7XG5pbXBvcnQgKiBhcyBBV1MgZnJvbSBcImF3cy1zZGstbW9ja1wiO1xuaW1wb3J0ICogYXMgc2lub24gZnJvbSBcInNpbm9uXCI7XG5pbXBvcnQgeyBBY2NvdW50VHlwZSB9IGZyb20gXCIuLi9saWJcIjtcbmltcG9ydCB7IGlzQ29tcGxldGVIYW5kbGVyLCBvbkV2ZW50SGFuZGxlciB9IGZyb20gXCIuLi9saWIvYWNjb3VudC1oYW5kbGVyXCI7XG5cbkFXUy5zZXRTREsocmVxdWlyZS5yZXNvbHZlKFwiYXdzLXNka1wiKSk7XG5cbmNvbnN0IGNyZWF0ZUV2ZW50OiBPbkV2ZW50UmVxdWVzdCA9IHtcbiAgUmVxdWVzdFR5cGU6IFwiQ3JlYXRlXCIsXG4gIFNlcnZpY2VUb2tlbjogXCJmYWtlVG9rZW5cIixcbiAgUmVzcG9uc2VVUkw6IFwiZmFrZVVybFwiLFxuICBTdGFja0lkOiBcImZha2VTdGFja0lkXCIsXG4gIFJlcXVlc3RJZDogXCJmYWtlUmVxSWRcIixcbiAgTG9naWNhbFJlc291cmNlSWQ6IFwiZmFrZUxvZ2ljYWxJZFwiLFxuICBSZXNvdXJjZVR5cGU6IFwiQ3VzdG9tOjpBY2NvdW50Q3JlYXRpb25cIixcbiAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgU2VydmljZVRva2VuOiBcImZha2VUb2tlblwiLFxuICAgIEVtYWlsOiBcImZha2VBbGlhcytmYWtlU3RhZ2VAYW1hem9uLmNvbVwiLFxuICAgIEFjY291bnROYW1lOiBcIldvcmtsb2FkLWZha2VTdGFnZVwiLFxuICAgIEFjY291bnRUeXBlOiBBY2NvdW50VHlwZS5TVEFHRSxcbiAgICBTdGFnZU5hbWU6IFwic3RhZ2UxXCIsXG4gICAgU3RhZ2VPcmRlcjogXCIxXCIsXG4gICAgSG9zdGVkU2VydmljZXM6IFwiYXBwMTphcHAyOmFwcDNcIlxuICB9LFxufTtcblxuXG5jb25zdCBpc0NvbXBsZXRlQ3JlYXRlRXZlbnQ6IElzQ29tcGxldGVSZXF1ZXN0ID0ge1xuICBSZXF1ZXN0VHlwZTogXCJDcmVhdGVcIixcbiAgU2VydmljZVRva2VuOiBcImZha2VUb2tlblwiLFxuICBSZXNwb25zZVVSTDogXCJmYWtlVXJsXCIsXG4gIFN0YWNrSWQ6IFwiZmFrZVN0YWNrSWRcIixcbiAgUmVxdWVzdElkOiBcImZha2VSZXFJZFwiLFxuICBMb2dpY2FsUmVzb3VyY2VJZDogXCJmYWtlTG9naWNhbElkXCIsXG4gIFJlc291cmNlVHlwZTogXCJDdXN0b206OkFjY291bnRDcmVhdGlvblwiLFxuICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICBTZXJ2aWNlVG9rZW46IFwiZmFrZVRva2VuXCIsXG4gIH0sXG4gIFBoeXNpY2FsUmVzb3VyY2VJZDogXCJmYWtlUmVxdWVzdENyZWF0ZUFjY291bnRTdGF0dXNJZFwiXG59XG5cbmNvbnN0IHVwZGF0ZUV2ZW50OiBPbkV2ZW50UmVxdWVzdCA9IHsgXG4gIC4uLiBjcmVhdGVFdmVudCwgXG4gIFJlcXVlc3RUeXBlOiBcIlVwZGF0ZVwiLCAgIFxuICBQaHlzaWNhbFJlc291cmNlSWQ6IFwiZmFrZVJlcXVlc3RDcmVhdGVBY2NvdW50U3RhdHVzSWRcIiBcbn1cbmNvbnN0IGlzQ29tcGxldGVVcGRhdGVFdmVudDogSXNDb21wbGV0ZVJlcXVlc3QgPSB7IFxuICAuLi4gaXNDb21wbGV0ZUNyZWF0ZUV2ZW50LCBcbiAgUmVxdWVzdFR5cGU6IFwiVXBkYXRlXCIsIFxuICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICBTZXJ2aWNlVG9rZW46ICB1cGRhdGVFdmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2VydmljZVRva2VuLCBcbiAgICBBY2NvdW50VHlwZTogdXBkYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkFjY291bnRUeXBlLFxuICAgIFN0YWdlTmFtZTogdXBkYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlN0YWdlTmFtZSxcbiAgICBTdGFnZU9yZGVyOiB1cGRhdGVFdmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU3RhZ2VPcmRlcixcbiAgICBIb3N0ZWRTZXJ2aWNlczogdXBkYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhvc3RlZFNlcnZpY2VzXG4gIH0gXG59XG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIEFXUy5yZXN0b3JlKCk7XG59KTtcblxudGVzdChcIm9uIGV2ZW50IGNyZWF0ZXMgYWNjb3VudCBmb3IgQ3JlYXRlIHJlcXVlc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgY3JlYXRlQWNjb3VudFJlcXVlc3RJZCA9IFwiZmFrZVJlcUlkXCI7XG4gIGNvbnN0IGNyZWF0ZUFjY291bnRNb2NrID0gc2lub24uZmFrZS5yZXNvbHZlcyh7XG4gICAgQ3JlYXRlQWNjb3VudFN0YXR1czogeyBJZDogY3JlYXRlQWNjb3VudFJlcXVlc3RJZCB9LFxuICB9KTtcblxuICBBV1MubW9jayhcIk9yZ2FuaXphdGlvbnNcIiwgXCJjcmVhdGVBY2NvdW50XCIsIGNyZWF0ZUFjY291bnRNb2NrKTtcblxuICBjb25zdCBkYXRhID0gYXdhaXQgb25FdmVudEhhbmRsZXIoY3JlYXRlRXZlbnQpO1xuXG4gIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoKGNyZWF0ZUFjY291bnRNb2NrLCB7XG4gICAgRW1haWw6IFwiZmFrZUFsaWFzK2Zha2VTdGFnZUBhbWF6b24uY29tXCIsXG4gICAgQWNjb3VudE5hbWU6IFwiV29ya2xvYWQtZmFrZVN0YWdlXCIsXG4gICAgVGFnczogW1xuICAgICAgeyBcbiAgICAgICAgS2V5OiBcIkVtYWlsXCIsIFxuICAgICAgICBWYWx1ZTogXCJmYWtlQWxpYXMrZmFrZVN0YWdlQGFtYXpvbi5jb21cIiBcbiAgICAgIH0sIFxuICAgICAgeyBcbiAgICAgICAgS2V5OiBcIkFjY291bnROYW1lXCIsIFxuICAgICAgICBWYWx1ZTogXCJXb3JrbG9hZC1mYWtlU3RhZ2VcIiBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEtleTogJ0FjY291bnRUeXBlJyxcbiAgICAgICAgVmFsdWU6IGNyZWF0ZUV2ZW50LlJlc291cmNlUHJvcGVydGllcy5BY2NvdW50VHlwZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgS2V5OiAnU3RhZ2VOYW1lJyxcbiAgICAgICAgVmFsdWU6IGNyZWF0ZUV2ZW50LlJlc291cmNlUHJvcGVydGllcy5TdGFnZU5hbWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEtleTogJ1N0YWdlT3JkZXInLFxuICAgICAgICBWYWx1ZTogY3JlYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlN0YWdlT3JkZXIudG9TdHJpbmcoKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgS2V5OiAnSG9zdGVkU2VydmljZXMnLFxuICAgICAgICBWYWx1ZTogY3JlYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhvc3RlZFNlcnZpY2VzXG4gICAgICB9XG4gICAgXSxcbiAgfSk7XG5cbiAgZXhwZWN0KGRhdGEpLnRvRXF1YWwoe1xuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogY3JlYXRlQWNjb3VudFJlcXVlc3RJZCxcbiAgfSk7XG59KTtcblxudGVzdChcIm9uIHVwZGF0ZSBldmVudCBkb2VzIG5vdCBjYWxsIGNyZWF0ZUFjY291bnQgZm9yIFVwZGF0ZSByZXF1ZXN0cyBidXQgZm9yd2FyZCBwcm9wZXJ0aWVzIHRvIGlzQ29tcGxldGVIYW5kbGVyIGZvciB0YWcgdXBkYXRlc1wiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZUFjY291bnRNb2NrID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgQVdTLm1vY2soXCJPcmdhbml6YXRpb25zXCIsIFwiY3JlYXRlQWNjb3VudFwiLCBjcmVhdGVBY2NvdW50TW9jayk7XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IG9uRXZlbnRIYW5kbGVyKHVwZGF0ZUV2ZW50KTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGNyZWF0ZUFjY291bnRNb2NrKTtcbiAgICBleHBlY3QoZGF0YSkudG9FcXVhbCh7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHVwZGF0ZUV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczogdXBkYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzXG4gICAgfSk7XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIGZvciBjcmVhdGUgdGhyb3cgd2l0aG91dCByZXF1ZXN0SWRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBkZXNjcmliZUNyZWF0ZUFjY291bnRTdGF0dXNNb2NrID0gc2lub24uZmFrZS5yZXNvbHZlcyh7fSk7XG5cbiAgQVdTLm1vY2soXG4gICAgXCJPcmdhbml6YXRpb25zXCIsXG4gICAgXCJkZXNjcmliZUNyZWF0ZUFjY291bnRTdGF0dXNcIixcbiAgICBkZXNjcmliZUNyZWF0ZUFjY291bnRTdGF0dXNNb2NrXG4gICk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBpc0NvbXBsZXRlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogXCJDcmVhdGVcIixcbiAgICAgIFNlcnZpY2VUb2tlbjogXCJmYWtlVG9rZW5cIixcbiAgICAgIFJlc3BvbnNlVVJMOiBcImZha2VVcmxcIixcbiAgICAgIFN0YWNrSWQ6IFwiZmFrZVN0YWNrSWRcIixcbiAgICAgIFJlcXVlc3RJZDogXCJmYWtlUmVxSWRcIixcbiAgICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBcImZha2VMb2dpY2FsSWRcIixcbiAgICAgIFJlc291cmNlVHlwZTogXCJDdXN0b206OkFjY291bnRDcmVhdGlvblwiLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogXCJmYWtlVG9rZW5cIixcbiAgICAgIH0sXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHVuZGVmaW5lZFxuICAgIH0pO1xuICAgIHNpbm9uLmFzc2VydC5mYWlsKCk7XG4gIH0gIGNhdGNoIChlcnJvcikge1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzTW9jayk7XG4gICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvRXF1YWwoXCJNaXNzaW5nIFBoeXNpY2FsUmVzb3VyY2VJZCBwYXJhbWV0ZXIuXCIpO1xuICB9XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIGZvciBjcmVhdGUgcmV0dXJucyBmYWxzZSB3aGVuIGFjY291bnQgY3JlYXRpb24gaXMgaW4gcHJvZ3Jlc3NcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBkZXNjcmliZUNyZWF0ZUFjY291bnRTdGF0dXNNb2NrID0gc2lub24uZmFrZS5yZXNvbHZlcyh7XG4gICAgQ3JlYXRlQWNjb3VudFN0YXR1czogXCJJTlBST0dSRVNTXCIsXG4gIH0pO1xuXG4gIEFXUy5tb2NrKFxuICAgIFwiT3JnYW5pemF0aW9uc1wiLFxuICAgIFwiZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzXCIsXG4gICAgZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzTW9ja1xuICApO1xuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBpc0NvbXBsZXRlSGFuZGxlcihpc0NvbXBsZXRlQ3JlYXRlRXZlbnQpO1xuXG4gIGV4cGVjdChkYXRhLklzQ29tcGxldGUpLnRvQmVGYWxzeTtcbn0pO1xuXG50ZXN0KFwiaXMgY29tcGxldGUgZm9yIGNyZWF0ZSByZXR1cm5zIHRydWUgd2hlbiBhY2NvdW50IGNyZWF0aW9uIGlzIGNvbXBsZXRlXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzTW9jayA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe1xuICAgIENyZWF0ZUFjY291bnRTdGF0dXM6IHtcbiAgICAgICAgU3RhdGU6IFwiU1VDQ0VFREVEXCIsXG4gICAgICAgIEFjY291bnRJZDogXCJmYWtlQWNjb3VudElkXCJcbiAgICB9XG4gIH0pO1xuXG4gIEFXUy5tb2NrKFxuICAgIFwiT3JnYW5pemF0aW9uc1wiLFxuICAgIFwiZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzXCIsXG4gICAgZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzTW9ja1xuICApO1xuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBpc0NvbXBsZXRlSGFuZGxlcihpc0NvbXBsZXRlQ3JlYXRlRXZlbnQpO1xuXG4gIGV4cGVjdChkYXRhLklzQ29tcGxldGUpLnRvQmVUcnV0aHk7XG4gIGV4cGVjdChkYXRhLkRhdGE/LkFjY291bnRJZCkudG9FcXVhbChcImZha2VBY2NvdW50SWRcIik7XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIGZvciB1cGRhdGUgdXBkYXRlcyB0YWdzIG9mIHRoZSBhY2NvdW50XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzTW9jayA9IHNpbm9uLmZha2UucmVzb2x2ZXMoe1xuICAgIENyZWF0ZUFjY291bnRTdGF0dXM6IHtcbiAgICAgICAgU3RhdGU6IFwiU1VDQ0VFREVEXCIsXG4gICAgICAgIEFjY291bnRJZDogXCJmYWtlQWNjb3VudElkXCJcbiAgICB9XG4gIH0pO1xuICBjb25zdCB0YWdSZXNvdXJjZU1vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcblxuICBBV1MubW9jayhcbiAgICBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICBcImRlc2NyaWJlQ3JlYXRlQWNjb3VudFN0YXR1c1wiLFxuICAgIGRlc2NyaWJlQ3JlYXRlQWNjb3VudFN0YXR1c01vY2tcbiAgKTtcblxuICBBV1MubW9jayhcbiAgICBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICBcInRhZ1Jlc291cmNlXCIsXG4gICAgdGFnUmVzb3VyY2VNb2NrXG4gICk7XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IGlzQ29tcGxldGVIYW5kbGVyKGlzQ29tcGxldGVVcGRhdGVFdmVudCk7XG5cbiAgZXhwZWN0KGRhdGEuSXNDb21wbGV0ZSkudG9CZVRydXRoeTtcbiAgZXhwZWN0KGRhdGEuRGF0YT8uQWNjb3VudElkKS50b0VxdWFsKFwiZmFrZUFjY291bnRJZFwiKTtcblxuICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aCh0YWdSZXNvdXJjZU1vY2ssIHtcbiAgICBSZXNvdXJjZUlkOiBcImZha2VBY2NvdW50SWRcIixcbiAgICBUYWdzOiBbXG4gICAgICB7XG4gICAgICAgIEtleTogJ0FjY291bnRUeXBlJyxcbiAgICAgICAgVmFsdWU6IGNyZWF0ZUV2ZW50LlJlc291cmNlUHJvcGVydGllcy5BY2NvdW50VHlwZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgS2V5OiAnU3RhZ2VOYW1lJyxcbiAgICAgICAgVmFsdWU6IGNyZWF0ZUV2ZW50LlJlc291cmNlUHJvcGVydGllcy5TdGFnZU5hbWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEtleTogJ1N0YWdlT3JkZXInLFxuICAgICAgICBWYWx1ZTogY3JlYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlN0YWdlT3JkZXIudG9TdHJpbmcoKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgS2V5OiAnSG9zdGVkU2VydmljZXMnLFxuICAgICAgICBWYWx1ZTogY3JlYXRlRXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkhvc3RlZFNlcnZpY2VzXG4gICAgICB9XG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIGZvciBkZWxldGUgIHRocm93c1wiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGRlc2NyaWJlQ3JlYXRlQWNjb3VudFN0YXR1c01vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHt9KTtcblxuICBBV1MubW9jayhcbiAgICBcIk9yZ2FuaXphdGlvbnNcIixcbiAgICBcImRlc2NyaWJlQ3JlYXRlQWNjb3VudFN0YXR1c1wiLFxuICAgIGRlc2NyaWJlQ3JlYXRlQWNjb3VudFN0YXR1c01vY2tcbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGlzQ29tcGxldGVIYW5kbGVyKHtcbiAgICAgIC4uLmlzQ29tcGxldGVDcmVhdGVFdmVudCxcbiAgICAgIFJlcXVlc3RUeXBlOiBcIkRlbGV0ZVwiLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0VxdWFsKFwiRGVsZXRlQWNjb3VudCBpcyBub3QgYSBzdXBwb3J0ZWQgb3BlcmF0aW9uXCIpO1xuICB9XG59KTtcbiJdfQ==