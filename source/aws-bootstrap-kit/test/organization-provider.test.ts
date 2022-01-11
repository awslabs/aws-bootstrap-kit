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
import { OnEventRequest } from "aws-cdk-lib/custom-resources/lib/provider-framework/types";
import * as AWS from "aws-sdk-mock";
import * as sinon from "sinon";
import { onEventHandler } from "../lib/organization-handler";

AWS.setSDK(require.resolve("aws-sdk"));

class AWSError extends Error {
    code: string;

    constructor(m: string, c: string) {
        super(m);
        this.name = "AWSError";
        this.code = c;
        this.stack = (new Error()).stack;
        Object.setPrototypeOf(this, AWSError.prototype);
    }
}

const createEvent: OnEventRequest = {
    RequestType: "Create",
    ServiceToken: "fakeToken",
    ResponseURL: "fakeUrl",
    StackId: "fakeStackId",
    RequestId: "fakeReqId",
    LogicalResourceId: "fakeLogicalId",
    ResourceType: "Custom::OrganizationCreation",
    ResourceProperties: {
        ServiceToken: "fakeToken"
    }
  };

afterEach(() => {
  AWS.restore();
});

test("on create event reuse Organization if already exists", async () => {
    const createOrgRequestId = "fakeReqId";

    const describeOrganizationMock = sinon.fake.resolves({
        Organization: { Id: createOrgRequestId}
    });

    AWS.mock("Organizations", "describeOrganization", describeOrganizationMock);

    const data = await onEventHandler(createEvent);

    expect(data).toEqual({ PhysicalResourceId: createOrgRequestId,
        Data: {
            OrganizationId: createOrgRequestId,
            ExistingOrg: true
        }
    });
});

test("on create event create Organization if not already exists", async () => {
    const error = new AWSError("Organization is not in use", "AWSOrganizationsNotInUseException");

    AWS.mock("Organizations", "describeOrganization", sinon.fake.throws(error));

    const createOrgRequestId = "fakeReqId";
    const createOrganizationMock = sinon.fake.resolves({
        Organization: { Id: createOrgRequestId}
    });

    AWS.mock("Organizations", "createOrganization", createOrganizationMock);

    const data = await onEventHandler(createEvent);

    sinon.assert.calledOnce(createOrganizationMock);

    expect(data).toEqual({ PhysicalResourceId: createOrgRequestId,
        Data: {
            OrganizationId: createOrgRequestId,
            ExistingOrg: false
        }
    });
})