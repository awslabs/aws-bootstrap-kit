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

import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cfg from '@aws-cdk/aws-config';


// from https://github.com/aws-samples/aws-startup-blueprint/blob/mainline/lib/aws-config-packs.ts
export class ConfigRecorder extends cdk.Construct {

	constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    
    const configBucket = new s3.Bucket(this, 'ConfigBucket', {blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL});

    configBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['*'],
        principals: [new iam.AnyPrincipal()],
        resources: [configBucket.bucketArn, configBucket.arnForObjects('*')],
        conditions: {
          Bool: {
            'aws:SecureTransport': false,
          },
        },
      }),
    );

    // Attach AWSConfigBucketPermissionsCheck to config bucket
    configBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('config.amazonaws.com')],
        resources: [configBucket.bucketArn],
        actions: ['s3:GetBucketAcl'],
      }),
    );

    // Attach AWSConfigBucketDelivery to config bucket
    configBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('config.amazonaws.com')],
        resources: [`${configBucket.bucketArn}/*`],
        actions: ['s3:PutObject'],
        conditions: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
          },
        },
      }),
    );

    new cfg.CfnDeliveryChannel(this, 'ConfigDeliveryChannel', {
      s3BucketName: configBucket.bucketName,
      name: "ConfigDeliveryChannel"
    });



    const configRole = new iam.Role(this, 'ConfigRecorderRole', {
      assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSConfigRole')]
    });    

    new cfg.CfnConfigurationRecorder(this, 'ConfigRecorder', {
      name: "BlueprintConfigRecorder",
      roleArn: configRole.roleArn,
      recordingGroup: {
        resourceTypes: [
          "AWS::IAM::User"
        ]
      }
    });
  }
}