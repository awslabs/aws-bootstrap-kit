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
require("@aws-cdk/assert/jest");
const AWS = require("aws-sdk-mock");
const sinon = require("sinon");
const validate_email_handler_1 = require("../lib/validate-email-handler");
const core_1 = require("@aws-cdk/core");
const validate_email_1 = require("../lib/validate-email");
test("Should throw Error if Email Prefix contains + ", () => {
    const validateEmailStack = () => new validate_email_1.ValidateEmail(new core_1.Stack(), "TestStack", {
        email: "test+test@test.com"
    });
    expect(validateEmailStack).toThrowError("Root Email should be without + in it");
});
AWS.setSDK(require.resolve("aws-sdk"));
const createEvent = {
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
const isCompleteCreateEvent = {
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
const deleteEvent = { ...createEvent, RequestType: 'Delete', PhysicalResourceId: 'validateEmail' };
const isCompleteDeleteEvent = { ...isCompleteCreateEvent, RequestType: 'Delete' };
afterEach(() => {
    AWS.restore();
});
test("on event create calls ses verifyEmailIdentity", async () => {
    const verifyEmailIdentityMock = sinon.fake.resolves(true);
    AWS.mock("SES", "verifyEmailIdentity", verifyEmailIdentityMock);
    const data = await validate_email_handler_1.onEventHandler(createEvent);
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
    const data = await validate_email_handler_1.onEventHandler(createEvent);
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
    await validate_email_handler_1.onEventHandler({
        ...createEvent,
        RequestType: "Update"
    });
    sinon.assert.notCalled(verifyEmailIdentityMock);
});
test("is complete will throw error without requestId", async () => {
    const getIdentityVerificationMock = sinon.fake.resolves(true);
    AWS.mock("SES", "getIdentityVerificationAttributes", getIdentityVerificationMock);
    try {
        await validate_email_handler_1.isCompleteHandler({
            ...isCompleteCreateEvent,
            PhysicalResourceId: undefined
        });
        sinon.assert.fail();
    }
    catch (error) {
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
    AWS.mock("SES", "getIdentityVerificationAttributes", getIdentityVerificationMock);
    const data = await validate_email_handler_1.isCompleteHandler(isCompleteCreateEvent);
    expect(data.IsComplete).toBeFalsy;
});
test("is complete for create returns true when email is verified", async () => {
    const getIdentityVerificationMock = sinon.fake.resolves({
        VerificationAttributes: {
            "test@test.com": { VerificationStatus: "Success" }
        }
    });
    AWS.mock("SES", "getIdentityVerificationAttributes", getIdentityVerificationMock);
    const data = await validate_email_handler_1.isCompleteHandler(isCompleteCreateEvent);
    expect(data.IsComplete).toBeTruthy;
});
test("on event delete no calls ses verifyEmailIdentity", async () => {
    const verifyEmailIdentityMock = sinon.fake.resolves(true);
    AWS.mock("SES", "verifyEmailIdentity", verifyEmailIdentityMock);
    const data = await validate_email_handler_1.onEventHandler(deleteEvent);
    sinon.assert.notCalled(verifyEmailIdentityMock);
    expect(data).toEqual({
        PhysicalResourceId: "validateEmail"
    });
});
test("is complete for delete returns true when email is verified", async () => {
    const data = await validate_email_handler_1.isCompleteHandler(isCompleteDeleteEvent);
    expect(data.IsComplete).toBeTruthy;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZW1haWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRlLWVtYWlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGLGdDQUE4QjtBQUs5QixvQ0FBb0M7QUFDcEMsK0JBQStCO0FBQy9CLDBFQUd1QztBQUN2Qyx3Q0FBc0M7QUFDdEMsMERBQXNEO0FBRXRELElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7SUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUUsQ0FDOUIsSUFBSSw4QkFBYSxDQUFDLElBQUksWUFBSyxFQUFFLEVBQUUsV0FBVyxFQUFFO1FBQzFDLEtBQUssRUFBRSxvQkFBb0I7S0FDNUIsQ0FBQyxDQUFDO0lBRUwsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsWUFBWSxDQUNyQyxzQ0FBc0MsQ0FDdkMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFFdkMsTUFBTSxXQUFXLEdBQW1CO0lBQ2xDLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLFlBQVksRUFBRSxXQUFXO0lBQ3pCLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFNBQVMsRUFBRSxXQUFXO0lBQ3RCLGlCQUFpQixFQUFFLGVBQWU7SUFDbEMsWUFBWSxFQUFFLHlCQUF5QjtJQUN2QyxrQkFBa0IsRUFBRTtRQUNsQixZQUFZLEVBQUUsV0FBVztRQUN6QixLQUFLLEVBQUUsZUFBZTtLQUN2QjtDQUNGLENBQUM7QUFFRixNQUFNLHFCQUFxQixHQUFzQjtJQUMvQyxXQUFXLEVBQUUsUUFBUTtJQUNyQixZQUFZLEVBQUUsV0FBVztJQUN6QixXQUFXLEVBQUUsU0FBUztJQUN0QixPQUFPLEVBQUUsYUFBYTtJQUN0QixTQUFTLEVB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QUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNyQyxDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyxrREFBa0QsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNsRSxNQUFNLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTFELEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFFaEUsTUFBTSxJQUFJLEdBQUcsTUFBTSx1Q0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRS9DLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFFaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNuQixrQkFBa0IsRUFBRSxlQUFlO0tBQ3BDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDREQUE0RCxFQUFFLEtBQUssSUFBSSxFQUFFO0lBRTVFLE1BQU0sSUFBSSxHQUFRLE1BQU0sMENBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNyQyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCBcIkBhd3MtY2RrL2Fzc2VydC9qZXN0XCI7XG5pbXBvcnQge1xuICBPbkV2ZW50UmVxdWVzdCxcbiAgSXNDb21wbGV0ZVJlcXVlc3Rcbn0gZnJvbSBcIkBhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMvbGliL3Byb3ZpZGVyLWZyYW1ld29yay90eXBlc1wiO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrLW1vY2tcIjtcbmltcG9ydCAqIGFzIHNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHtcbiAgaXNDb21wbGV0ZUhhbmRsZXIsXG4gIG9uRXZlbnRIYW5kbGVyXG59IGZyb20gXCIuLi9saWIvdmFsaWRhdGUtZW1haWwtaGFuZGxlclwiO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHsgVmFsaWRhdGVFbWFpbCB9IGZyb20gXCIuLi9saWIvdmFsaWRhdGUtZW1haWxcIjtcblxudGVzdChcIlNob3VsZCB0aHJvdyBFcnJvciBpZiBFbWFpbCBQcmVmaXggY29udGFpbnMgKyBcIiwgKCkgPT4ge1xuICBjb25zdCB2YWxpZGF0ZUVtYWlsU3RhY2sgPSAoKSA9PlxuICAgIG5ldyBWYWxpZGF0ZUVtYWlsKG5ldyBTdGFjaygpLCBcIlRlc3RTdGFja1wiLCB7XG4gICAgICBlbWFpbDogXCJ0ZXN0K3Rlc3RAdGVzdC5jb21cIlxuICAgIH0pO1xuXG4gIGV4cGVjdCh2YWxpZGF0ZUVtYWlsU3RhY2spLnRvVGhyb3dFcnJvcihcbiAgICBcIlJvb3QgRW1haWwgc2hvdWxkIGJlIHdpdGhvdXQgKyBpbiBpdFwiXG4gICk7XG59KTtcblxuQVdTLnNldFNESyhyZXF1aXJlLnJlc29sdmUoXCJhd3Mtc2RrXCIpKTtcblxuY29uc3QgY3JlYXRlRXZlbnQ6IE9uRXZlbnRSZXF1ZXN0ID0ge1xuICBSZXF1ZXN0VHlwZTogXCJDcmVhdGVcIixcbiAgU2VydmljZVRva2VuOiBcImZha2VUb2tlblwiLFxuICBSZXNwb25zZVVSTDogXCJmYWtlVXJsXCIsXG4gIFN0YWNrSWQ6IFwiZmFrZVN0YWNrSWRcIixcbiAgUmVxdWVzdElkOiBcImZha2VSZXFJZFwiLFxuICBMb2dpY2FsUmVzb3VyY2VJZDogXCJmYWtlTG9naWNhbElkXCIsXG4gIFJlc291cmNlVHlwZTogXCJDdXN0b206OkVtYWlsVmFsaWRhdGlvblwiLFxuICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICBTZXJ2aWNlVG9rZW46IFwiZmFrZVRva2VuXCIsXG4gICAgZW1haWw6IFwidGVzdEB0ZXN0LmNvbVwiXG4gIH1cbn07XG5cbmNvbnN0IGlzQ29tcGxldGVDcmVhdGVFdmVudDogSXNDb21wbGV0ZVJlcXVlc3QgPSB7XG4gIFJlcXVlc3RUeXBlOiBcIkNyZWF0ZVwiLFxuICBTZXJ2aWNlVG9rZW46IFwiZmFrZVRva2VuXCIsXG4gIFJlc3BvbnNlVVJMOiBcImZha2VVcmxcIixcbiAgU3RhY2tJZDogXCJmYWtlU3RhY2tJZFwiLFxuICBSZXF1ZXN0SWQ6IFwiZmFrZVJlcUlkXCIsXG4gIExvZ2ljYWxSZXNvdXJjZUlkOiBcImZha2VMb2dpY2FsSWRcIixcbiAgUmVzb3VyY2VUeXBlOiBcIkN1c3RvbTo6RW1haWxWYWxpZGF0aW9uXCIsXG4gIFJlc291cmNlUHJvcGVydGllczoge1xuICAgIFNlcnZpY2VUb2tlbjogXCJmYWtlVG9rZW5cIixcbiAgICBFbWFpbDogXCJ0ZXN0QHRlc3QuY29tXCJcbiAgfSxcbiAgUGh5c2ljYWxSZXNvdXJjZUlkOiBcImZha2VSZXF1ZXN0Q3JlYXRlQWNjb3VudFN0YXR1c0lkXCJcbn07XG5cbmNvbnN0IGRlbGV0ZUV2ZW50ID0geyAuLi5jcmVhdGVFdmVudCwgUmVxdWVzdFR5cGU6ICdEZWxldGUnLCBQaHlzaWNhbFJlc291cmNlSWQ6ICd2YWxpZGF0ZUVtYWlsJyB9XG5jb25zdCBpc0NvbXBsZXRlRGVsZXRlRXZlbnQ6IElzQ29tcGxldGVSZXF1ZXN0ID0geyAuLi5pc0NvbXBsZXRlQ3JlYXRlRXZlbnQsIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyB9XG5cbmFmdGVyRWFjaCgoKSA9PiB7XG4gIEFXUy5yZXN0b3JlKCk7XG59KTtcblxudGVzdChcIm9uIGV2ZW50IGNyZWF0ZSBjYWxscyBzZXMgdmVyaWZ5RW1haWxJZGVudGl0eVwiLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHZlcmlmeUVtYWlsSWRlbnRpdHlNb2NrID0gc2lub24uZmFrZS5yZXNvbHZlcyh0cnVlKTtcblxuICBBV1MubW9jayhcIlNFU1wiLCBcInZlcmlmeUVtYWlsSWRlbnRpdHlcIiwgdmVyaWZ5RW1haWxJZGVudGl0eU1vY2spO1xuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBvbkV2ZW50SGFuZGxlcihjcmVhdGVFdmVudCk7XG5cbiAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGgodmVyaWZ5RW1haWxJZGVudGl0eU1vY2ssIHtcbiAgICBFbWFpbEFkZHJlc3M6IFwidGVzdEB0ZXN0LmNvbVwiXG4gIH0pO1xuXG4gIGV4cGVjdChkYXRhKS50b0VxdWFsKHtcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IFwidmFsaWRhdGVFbWFpbFwiXG4gIH0pO1xufSk7XG5cbnRlc3QoXCJvbiBjb21wbGV0aW9uIGV2ZW50IGNhbGxzIHNlcyBnZXRJZGVudGl0eVZlcmlmaWNhdGlvbkF0dHJpYnV0ZXNcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCB2ZXJpZnlFbWFpbElkZW50aXR5TW9jayA9IHNpbm9uLmZha2UucmVzb2x2ZXModHJ1ZSk7XG4gIEFXUy5tb2NrKFwiU0VTXCIsIFwidmVyaWZ5RW1haWxJZGVudGl0eVwiLCB2ZXJpZnlFbWFpbElkZW50aXR5TW9jayk7XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IG9uRXZlbnRIYW5kbGVyKGNyZWF0ZUV2ZW50KTtcblxuICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aCh2ZXJpZnlFbWFpbElkZW50aXR5TW9jaywge1xuICAgIEVtYWlsQWRkcmVzczogXCJ0ZXN0QHRlc3QuY29tXCJcbiAgfSk7XG5cbiAgZXhwZWN0KGRhdGEpLnRvRXF1YWwoe1xuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogXCJ2YWxpZGF0ZUVtYWlsXCJcbiAgfSk7XG59KTtcblxudGVzdChcIm9uIGV2ZW50IGRvZXMgbm90IGNhbGwgdmVyaWZ5RW1haWxJZGVudGl0eSBmb3IgVXBkYXRlIHJlcXVlc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgdmVyaWZ5RW1haWxJZGVudGl0eU1vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHRydWUpO1xuICBBV1MubW9jayhcIlNFU1wiLCBcInZlcmlmeUVtYWlsSWRlbnRpdHlcIiwgdmVyaWZ5RW1haWxJZGVudGl0eU1vY2spO1xuXG4gIGF3YWl0IG9uRXZlbnRIYW5kbGVyKHtcbiAgICAuLi5jcmVhdGVFdmVudCxcbiAgICBSZXF1ZXN0VHlwZTogXCJVcGRhdGVcIlxuICB9KTtcbiAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZCh2ZXJpZnlFbWFpbElkZW50aXR5TW9jayk7XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIHdpbGwgdGhyb3cgZXJyb3Igd2l0aG91dCByZXF1ZXN0SWRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBnZXRJZGVudGl0eVZlcmlmaWNhdGlvbk1vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHRydWUpO1xuXG4gIEFXUy5tb2NrKFxuICAgIFwiU0VTXCIsXG4gICAgXCJnZXRJZGVudGl0eVZlcmlmaWNhdGlvbkF0dHJpYnV0ZXNcIixcbiAgICBnZXRJZGVudGl0eVZlcmlmaWNhdGlvbk1vY2tcbiAgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGlzQ29tcGxldGVIYW5kbGVyKHtcbiAgICAgIC4uLmlzQ29tcGxldGVDcmVhdGVFdmVudCxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogdW5kZWZpbmVkXG4gICAgfSk7XG4gICAgc2lub24uYXNzZXJ0LmZhaWwoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGdldElkZW50aXR5VmVyaWZpY2F0aW9uTW9jayk7XG4gICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvRXF1YWwoXCJNaXNzaW5nIFBoeXNpY2FsUmVzb3VyY2VJZCBwYXJhbWV0ZXIuXCIpO1xuICB9XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIGZvciBjcmVhdGUgcmV0dXJucyBmYWxzZSB3aGVuIGVtYWlsIGlzIG5vdCB2ZXJpZmllZCB5ZXRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBnZXRJZGVudGl0eVZlcmlmaWNhdGlvbk1vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHtcbiAgICBWZXJpZmljYXRpb25BdHRyaWJ1dGVzOiB7XG4gICAgICBcInRlc3RAdGVzdC5jb21cIjogeyBWZXJpZmljYXRpb25TdGF0dXM6IFwiUHJvZ3Jlc3NcIiB9XG4gICAgfVxuICB9KTtcblxuICBBV1MubW9jayhcbiAgICBcIlNFU1wiLFxuICAgIFwiZ2V0SWRlbnRpdHlWZXJpZmljYXRpb25BdHRyaWJ1dGVzXCIsXG4gICAgZ2V0SWRlbnRpdHlWZXJpZmljYXRpb25Nb2NrXG4gICk7XG5cbiAgY29uc3QgZGF0YTogYW55ID0gYXdhaXQgaXNDb21wbGV0ZUhhbmRsZXIoaXNDb21wbGV0ZUNyZWF0ZUV2ZW50KTtcblxuICBleHBlY3QoZGF0YS5Jc0NvbXBsZXRlKS50b0JlRmFsc3k7XG59KTtcblxudGVzdChcImlzIGNvbXBsZXRlIGZvciBjcmVhdGUgcmV0dXJucyB0cnVlIHdoZW4gZW1haWwgaXMgdmVyaWZpZWRcIiwgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBnZXRJZGVudGl0eVZlcmlmaWNhdGlvbk1vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHtcbiAgICBWZXJpZmljYXRpb25BdHRyaWJ1dGVzOiB7XG4gICAgICBcInRlc3RAdGVzdC5jb21cIjogeyBWZXJpZmljYXRpb25TdGF0dXM6IFwiU3VjY2Vzc1wiIH1cbiAgICB9XG4gIH0pO1xuXG4gIEFXUy5tb2NrKFxuICAgIFwiU0VTXCIsXG4gICAgXCJnZXRJZGVudGl0eVZlcmlmaWNhdGlvbkF0dHJpYnV0ZXNcIixcbiAgICBnZXRJZGVudGl0eVZlcmlmaWNhdGlvbk1vY2tcbiAgKTtcblxuICBjb25zdCBkYXRhOiBhbnkgPSBhd2FpdCBpc0NvbXBsZXRlSGFuZGxlcihpc0NvbXBsZXRlQ3JlYXRlRXZlbnQpO1xuXG4gIGV4cGVjdChkYXRhLklzQ29tcGxldGUpLnRvQmVUcnV0aHk7XG59KTtcblxuXG50ZXN0KFwib24gZXZlbnQgZGVsZXRlIG5vIGNhbGxzIHNlcyB2ZXJpZnlFbWFpbElkZW50aXR5XCIsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgdmVyaWZ5RW1haWxJZGVudGl0eU1vY2sgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHRydWUpO1xuXG4gIEFXUy5tb2NrKFwiU0VTXCIsIFwidmVyaWZ5RW1haWxJZGVudGl0eVwiLCB2ZXJpZnlFbWFpbElkZW50aXR5TW9jayk7XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IG9uRXZlbnRIYW5kbGVyKGRlbGV0ZUV2ZW50KTtcblxuICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKHZlcmlmeUVtYWlsSWRlbnRpdHlNb2NrKTtcblxuICBleHBlY3QoZGF0YSkudG9FcXVhbCh7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBcInZhbGlkYXRlRW1haWxcIlxuICB9KTtcbn0pO1xuXG50ZXN0KFwiaXMgY29tcGxldGUgZm9yIGRlbGV0ZSByZXR1cm5zIHRydWUgd2hlbiBlbWFpbCBpcyB2ZXJpZmllZFwiLCBhc3luYyAoKSA9PiB7XG5cbiAgY29uc3QgZGF0YTogYW55ID0gYXdhaXQgaXNDb21wbGV0ZUhhbmRsZXIoaXNDb21wbGV0ZURlbGV0ZUV2ZW50KTtcblxuICBleHBlY3QoZGF0YS5Jc0NvbXBsZXRlKS50b0JlVHJ1dGh5O1xufSk7Il19