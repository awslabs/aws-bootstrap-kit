const { awscdk } = require('projen');
const cdkVersion = '2.60.0';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'AWS EMEA SA Specialist Builders',
  authorAddress: 'chazalf@amazon.com',
  cdkVersion: cdkVersion,
  defaultReleaseBranch: 'main',
  minNodeVersion: '16.0.0',
  workflowNodeVersion: 16,
  name: 'aws-bootstrap-kit',
  repositoryUrl: 'https://github.com/awslabs/aws-bootstrap-kit',
  publishToPypi: {
    distName: 'aws_ssabuilders.aws_bootstrap_kit',
    module: 'aws_ssabuilders.aws_bootstrap_kit',
  },
  releaseToNpm: true,
  devDeps: [
    `@aws-cdk/assert@${cdkVersion}`,
    `@aws-cdk/cx-api@${cdkVersion}`,
    `aws-cdk@${cdkVersion}`,
    `cdk-assets@${cdkVersion}`,
    '@types/aws-lambda',
    'aws-sdk-mock',
    'sinon',
    '@types/sinon',
    'promptly',
    'jest-runner-groups',
  ],
  jestOptions: {
    jestConfig: {
      runner: 'groups',
    },
  },

});

project.testTask.reset('jest --group=unit');

project.addTask('test:unit', {
  exec: 'jest --group=unit',
});

project.addTask('test:integ', {
  exec: 'jest --group=integ',
});

project.synth();
