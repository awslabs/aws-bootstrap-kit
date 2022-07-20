/**
 * @group integ/organization-unit-provider
 */

import * as cdk from 'aws-cdk-lib';
import { deployStack, destroyStack } from './utils';
import { DeployStackResult } from 'aws-cdk/lib/api/deploy-stack';
import { OrganizationalUnit } from '../../lib/organizational-unit';
import { Organizations, STS } from 'aws-sdk';

jest.setTimeout(250000);

// SETUP
let integTestApp: cdk.App;
let stack: cdk.Stack;
let deployResult: DeployStackResult;
const orgClient = new Organizations({ region: 'us-east-1' });
const sts = new STS({ region: 'us-east-1' });

beforeEach(() => {
  integTestApp = new cdk.App({
    context: {
      '@aws-cdk/core:bootstrapQualifier': 'integtest',
    },
  });
  stack = new cdk.Stack(integTestApp, `OUManagementTest-${expect.getState().currentTestName}-Stack`);
});

afterEach(async () => {
  if (deployResult) {
    await destroyStack(integTestApp, stack, true);
    await orgClient.deleteOrganizationalUnit({ OrganizationalUnitId: deployResult.outputs.OUId }).promise();
  }
});

test('create-ou', async () => {
  //GIVEN
  const ouName = 'OU';
  const currentAccount = await sts.getCallerIdentity().promise().then(id => id.Account);
  const parentOrg = await orgClient.listParents({ ChildId: currentAccount! }).promise();
  const ou = new OrganizationalUnit(stack, 'OU', {
    Name: ouName,
    ParentId: parentOrg.Parents![0].Id!,
  });

  new cdk.CfnOutput(stack, 'OUId', {
    value: ou.id,
  });


  // WHEN 
  try {
    deployResult = await deployStack(integTestApp, stack, false);
    console.log('deployed');
  } catch (error) {
    console.error('failed to deploy', error);
    fail();
  }
  // THEN
  console.log('then');
  const organizationalUnits = await orgClient
    .listOrganizationalUnitsForParent({
      ParentId: parentOrg.Parents![0].Id!,
    })
    .promise();
  expect(organizationalUnits.OrganizationalUnits?.find((ou) => ou.Id ===  deployResult.outputs.OUId)?.Name).toBe(ouName);
}, 300000);
