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

/**
 * @group unit/organizational-unit-provider
 */

import { OnEventRequest } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
import * as AWS from 'aws-sdk-mock';
import * as sinon from 'sinon';
import { onEventHandler } from '../../lib/ou-handler';

AWS.setSDK(require.resolve('aws-sdk'));

const createEvent: OnEventRequest = {
  RequestType: 'Create',
  ServiceToken: 'fakeToken',
  ResponseURL: 'fakeUrl',
  StackId: 'fakeStackId',
  RequestId: 'fakeReqId',
  LogicalResourceId: 'fakeLogicalId',
  ResourceType: 'Custom::OrganizationalUnitCreation',
  ResourceProperties: {
    ServiceToken: 'fakeToken',
    ParentId: 'fakeParentId',
    Name: 'fakeOUName',
  },
};

const updateEvent: OnEventRequest = {
  RequestType: 'Update',
  ServiceToken: 'fakeToken',
  ResponseURL: 'fakeUrl',
  StackId: 'fakeStackId',
  RequestId: 'fakeReqId',
  LogicalResourceId: 'fakeLogicalId',
  PhysicalResourceId: 'ou-fakeOUId',
  ResourceType: 'Custom::OrganizationalUnitCreation',
  ResourceProperties: {
    ServiceToken: 'fakeToken',
    ParentId: 'fakeParentId',
    Name: 'fakeUdaptedOUName',
  },
};

afterEach(() => {
  AWS.restore();
});

test('on create event creates OU if does not exists', async () => {
  const OUId = 'ou-fakeOUId';
  const listOUsMock = sinon.fake.resolves({
    OrganizationalUnits: [
      {
        Id: 'ou-abcd',
        Name: 'Abcd',
      },
      {
        Id: 'ou-efgh',
        Name: 'Efgh',
      },
    ],
  });
  AWS.mock('Organizations', 'listOrganizationalUnitsForParent', listOUsMock);

  const createOUMock = sinon.fake.resolves({
    OrganizationalUnit: {
      Id: OUId,
      Name: 'fakeOUName',
    },
  });
  AWS.mock('Organizations', 'createOrganizationalUnit', createOUMock);

  const data = await onEventHandler(createEvent);

  expect(data).toEqual({
    PhysicalResourceId: OUId,
    Data: {
      OrganizationalUnitId: OUId,
      ExistingOU: false,
    },
  });
});

test('on create event reuses OU if already exists', async () => {
  const OUId = 'ou-fakeOUId';
  const listOUsMock = sinon.fake.resolves({
    OrganizationalUnits: [
      {
        Id: 'ou-abcd',
        Name: 'Abcd',
      },
      {
        Id: OUId,
        Name: 'fakeOUName',
      },
    ],
  });
  AWS.mock('Organizations', 'listOrganizationalUnitsForParent', listOUsMock);

  const data = await onEventHandler(createEvent);

  expect(data).toEqual({
    PhysicalResourceId: OUId,
    Data: {
      OrganizationalUnitId: OUId,
      ExistingOU: true,
    },
  });
});

test('on update event, it reuses OU if already exists and change its name', async () => {
  const OUId = 'ou-fakeOUId';
  const listOUsMock = sinon.fake.resolves({
    OrganizationalUnits: [
      {
        Id: 'ou-abcd',
        Name: 'Abcd',
      },
      {
        Id: OUId,
        Name: 'fakeOUName',
      },
    ],
  });
  AWS.mock('Organizations', 'listOrganizationalUnitsForParent', listOUsMock);

  const updateOUMock = sinon.fake.resolves({
    OrganizationalUnit: {
      Id: OUId,
      Name: 'fakeUpdatedOUName',
    },
  });
  AWS.mock('Organizations', 'updateOrganizationalUnit', updateOUMock);


  const data = await onEventHandler(updateEvent);

  expect(data).toEqual({
    PhysicalResourceId: OUId,
    Data: {
      OrganizationalUnitId: OUId,
    },
  });
});

test('on create event reuses OU if already exists (nextToken)', async () => {
  const OUId = 'ou-fakeOUId';

  let stub = sinon.stub();
  stub.onCall(0).resolves({
    OrganizationalUnits: [
      {
        Id: 'ou-abcd',
        Name: 'Abcd',
      },
      {
        Id: 'ou-efgh',
        Name: 'Efgh',
      },
    ],
    NextToken: 'abc123',
  });
  stub.onCall(1).resolves({
    OrganizationalUnits: [
      {
        Id: 'ou-ijkl',
        Name: 'Ijkl',
      },
      {
        Id: OUId,
        Name: 'fakeOUName',
      },
    ],
  });
  AWS.mock('Organizations', 'listOrganizationalUnitsForParent', stub);

  const data = await onEventHandler(createEvent);

  expect(data).toEqual({
    PhysicalResourceId: OUId,
    Data: {
      OrganizationalUnitId: OUId,
      ExistingOU: true,
    },
  });

  sinon.assert.calledTwice(stub);
});
