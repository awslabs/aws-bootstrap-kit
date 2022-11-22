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

import delivlib = require('aws-delivlib');
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';

export class PipelineStack extends cdk.Stack {
  constructor(parent : cdk.App, id : string, props : cdk.StackProps = { }) {
    super(parent, id, props);


    console.log(`PATH: ${path.join(__dirname, 'superchain')}`);
    const pipeline = new delivlib.Pipeline(this, 'AWSBootrapKitPipeline', {
      repo: new delivlib.GitHubRepo({
        repository: 'awslabs/aws-bootstrap-kit',
        tokenSecretArn: 'arn:aws:secretsmanager:us-west-2:226122282356:secret:github-token-jc23ht'
      }),
      title: 'CDK Constructs',
      branch: 'main',
      pipelineName: 'AWSBootsrapKit-cdk-constructs',
      notificationEmail: 'aws-emea-spe-build@amazon.com',
      buildImage: cdk.aws_codebuild.LinuxBuildImage.fromAsset(this, 'Superchain', {
        directory: path.join(__dirname, 'superchain'),
      }),
      buildSpec: cdk.aws_codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            commands: [
              'npm install -g lerna', // Update npm itself
              'lerna bootstrap'
            ],
          },
          build: {
            commands: [
              'lerna run test',
              'lerna run build',
              'lerna run package'
            ],
          },
        },
        artifacts: {
          'files': [ '**/*' ],
          'base-directory': 'source/aws-bootstrap-kit/dist',
        },
      }),
    });

    // Publish artifacts to NPM (or maven, nuget), if they don't exist already
    pipeline.publishToNpm({
      npmTokenSecret: { secretArn: 'arn:aws:secretsmanager:us-west-2:226122282356:secret:spe-builders/npm-9jwNw0' },
    });
    pipeline.publishToPyPI({
      loginSecret: {
        secretArn: 'arn:aws:secretsmanager:us-west-2:226122282356:secret:spe-builders/pypi-sIsz9M',
      }
    });
  }
}