import { App, Stack } from 'aws-cdk-lib';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormationDeployments } from 'aws-cdk/lib/api/cloudformation-deployments';
import { SdkProvider } from 'aws-cdk/lib/api/aws-auth';
import { DeployStackResult } from 'aws-cdk/lib/api/deploy-stack';

export const deployStack = async (app: App, stack: Stack, quiet?: boolean): Promise<DeployStackResult> => {
  console.log('getStackArtifact');
  const stackArtifact = getStackArtifact(app, stack);

  console.log('createCloudFormationDeployments');
  const cloudFormation = await createCloudFormationDeployments();

  console.log('deployStack');
  return cloudFormation.deployStack({
    stack: stackArtifact,
    quiet: quiet ? false : false,
  });
};

export const destroyStack = async (app: App, stack: Stack, quiet?: boolean, retryCount?: number): Promise<void> => {
  const stackArtifact = getStackArtifact(app, stack);

  const cloudFormation = await createCloudFormationDeployments();

  retryCount = retryCount || 1;
  while (retryCount >= 0) {
    try {
      await cloudFormation.destroyStack({
        stack: stackArtifact,
        quiet: quiet ? quiet : true,
      });
    } catch (e) {
      console.error(`Fail to delete stack retrying`);
      if(retryCount == 0) {
        throw e;
      }
    }
    retryCount--;
  }
};

export const getOutput = (deployment: DeployStackResult, stackName: string, outputName: string): string => {
    const matchingOuput = Object.fromEntries(Object.entries(deployment.outputs).filter(([key]) => key.startsWith(stackName+outputName)));
    if (Object.keys(matchingOuput).length === 0 ) {
        throw new Error(`No output matching ${outputName}!`);
    }
    return matchingOuput[Object.keys(matchingOuput)[0]];
};

const getStackArtifact = (app: App, stack: Stack): cxapi.CloudFormationStackArtifact => {
  const synthesized = app.synth();

  // Reload the synthesized artifact for stack using the cxapi from dependencies
  const assembly = new cxapi.CloudAssembly(synthesized.directory);

  return cxapi.CloudFormationStackArtifact.fromManifest(
    assembly,
    stack.artifactId,
    synthesized.getStackArtifact(stack.artifactId).manifest
  ) as cxapi.CloudFormationStackArtifact;
};

const createCloudFormationDeployments = async (): Promise<CloudFormationDeployments> => {
  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
    profile: process.env.AWS_PROFILE,
  });
  const cloudFormation = new CloudFormationDeployments({ sdkProvider });

  return cloudFormation;
};