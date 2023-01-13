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
 * @group unit/cross-account-dns-delegator
 */

import { OnEventRequest } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
import { examples as route53Examples } from 'aws-sdk/apis/route53-2013-04-01.examples.json';
import { examples as stsExamples } from 'aws-sdk/apis/sts-2011-06-15.examples.json';
import * as AWS from 'aws-sdk-mock';
import * as sinon from 'sinon';
import { onEventHandler } from '../../src/dns/delegation-record-handler/index';

AWS.setSDK(require.resolve('aws-sdk'));

const assumedRole = stsExamples.AssumeRole[0].output;
const changeResourceRecordSets = route53Examples.ChangeResourceRecordSets[0].output;
const fakeRecordName = 'app.stage.domain.com';
const fakeCurrentAccountId = '987654321987';
const fakeNameServer = ['ns1.test.com', 'ns2.test.com'];
const roleNameToAssume = 'stage.domain.com-dns-update';
const dnsAccountId = '123456789123';
const targetHostedZoneId = 'ABCDEFGHYZ';

const fakeListHostedZonesByNameResponse = {
  HostedZones: [
    {
      Id: targetHostedZoneId,
      Name: `${fakeRecordName.split('.').splice(1).join('.')}.`,
      CallerReference: 'fakeCallerRef',
      Config: {
        PrivateZone: false,
      },
      ResourceRecordSetCount: 3,
    },
    {
      Id: 'ROOTHOSTEDZONEID',
      Name: `${fakeRecordName.split('.').splice(2).join('.')}.`,
      CallerReference: 'fakeCallerRef',
      Config: {
        PrivateZone: false,
      },
      ResourceRecordSetCount: 7,
    },
  ],
  IsTruncated: false,
  MaxItems: '100',
};

const fakeListAccountsResponse = {
  Accounts: [
    {
      Id: fakeCurrentAccountId,
      Arn: `arn:aws:organizations::111111111111:account/o-1111111/${fakeCurrentAccountId}`,
      Email: 'admin+Stage-111111111111@domain.com',
      Name: 'Stage',
      Status: 'ACTIVE',
      JoinedMethod: 'CREATED',
      JoinedTimestamp: '2020-11-08T16:12:36.557000+01:00',
    },
    {
      Id: dnsAccountId,
      Arn: 'arn:aws:organizations::111111111111:account/o-1ftjq7eeqg/111111111111',
      Email: 'admin+main@domain.com',
      Name: 'Main',
      Status: 'ACTIVE',
      JoinedMethod: 'INVITED',
      JoinedTimestamp: '2020-11-08T16:09:23.737000+01:00',
    },
  ],
};


const createEvent: OnEventRequest = {
  RequestType: 'Create',
  ServiceToken: 'fakeToken',
  ResponseURL: 'fakeUrl',
  StackId: 'fakeStackId',
  RequestId: 'fakeReqId',
  LogicalResourceId: 'fakeLogicalId',
  ResourceType: 'Custom::CrossAccountZoneDelegationRecord',
  ResourceProperties: {
    ServiceToken: 'fakeToken',
    targetAccount: dnsAccountId,
    targetRoleToAssume: roleNameToAssume,
    targetHostedZoneId: targetHostedZoneId,
    toDelegateNameServers: fakeNameServer,
    recordName: fakeRecordName,
    currentAccountId: fakeCurrentAccountId,
  },
};

afterEach(() => {
  AWS.restore();
});

test('when everything provided the right role is assumed and the right resource is changed', async () => {
  const assumedRoleMock = sinon.fake.resolves(assumedRole);
  const changeResourceRecordSetsMock = sinon.fake.resolves(changeResourceRecordSets);

  AWS.mock('STS', 'assumeRole', assumedRoleMock);

  AWS.mock('Route53', 'changeResourceRecordSets', changeResourceRecordSetsMock);
  await onEventHandler(createEvent);

  sinon.assert.calledWith(assumedRoleMock, {
    RoleArn: `arn:aws:iam::${dnsAccountId}:role/${roleNameToAssume}`,
    RoleSessionName: 'fakeLogicalId',
  });

  sinon.assert.calledWith(assumedRoleMock, {
    RoleArn: `arn:aws:iam::${dnsAccountId}:role/${roleNameToAssume}`,
    RoleSessionName: 'fakeLogicalId',
  });

  sinon.assert.calledWith(changeResourceRecordSetsMock,
    {
      ChangeBatch: {
        Changes: [{
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: fakeRecordName,
            ResourceRecords: [{ Value: fakeNameServer[0] }, { Value: fakeNameServer[1] }],
            TTL: 300,
            Type: 'NS',
          },
        }],
      },
      HostedZoneId: targetHostedZoneId,
    });
});


test('when nothing is provided the right role is assumed and the right resource is changed', async () => {
  const assumedRoleMock = sinon.fake.resolves(assumedRole);
  const changeResourceRecordSetsMock = sinon.fake.resolves(changeResourceRecordSets);
  const listHostedZonesByNameMock = sinon.fake.resolves(fakeListHostedZonesByNameResponse);
  const listAccountsMock = sinon.fake.resolves(fakeListAccountsResponse);

  AWS.mock('STS', 'assumeRole', assumedRoleMock);

  AWS.mock('Route53', 'changeResourceRecordSets', changeResourceRecordSetsMock);

  AWS.mock('Organizations', 'listAccounts', listAccountsMock);
  AWS.mock('Route53', 'listHostedZonesByName', listHostedZonesByNameMock);

  createEvent.ResourceProperties = {
    ServiceToken: 'fakeToken',
    recordName: fakeRecordName,
    toDelegateNameServers: fakeNameServer,
    currentAccountId: fakeCurrentAccountId,
  };

  await onEventHandler(createEvent);

  sinon.assert.calledWith(listHostedZonesByNameMock, {
    DNSName: 'stage.domain.com',
  });

  sinon.assert.calledWith(assumedRoleMock, {
    RoleArn: `arn:aws:iam::${dnsAccountId}:role/${roleNameToAssume}`,
    RoleSessionName: 'fakeLogicalId',
  });

  sinon.assert.calledWith(changeResourceRecordSetsMock,
    {
      ChangeBatch: {
        Changes: [{
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: fakeRecordName,
            ResourceRecords: [{ Value: fakeNameServer[0] }, { Value: fakeNameServer[1] }],
            TTL: 300,
            Type: 'NS',
          },
        }],
      },
      HostedZoneId: targetHostedZoneId,
    });
});
