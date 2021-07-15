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

import * as core from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId, AwsCustomResourcePolicy } from "@aws-cdk/custom-resources";
import { Bucket, BlockPublicAccess } from '@aws-cdk/aws-s3';
import { Effect, PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam';

/**
 * The properties of an OrganizationTrail
 */
export interface IOrganizationTrailProps {
    /**
     * The Id of the organization which the trail works on
     */
    OrganizationId: string
}

/**
 * This represents an organization trail. An organization trail logs all events for all AWS accounts in that organization 
 * and write them in a dedicated S3 bucket in the master account of the organization. To deploy this construct you should
 * the credential of the master account of your organization. It deploys a S3 bucket, enables cloudtrail.amazonaws.com to
 * access the organization API, creates an organization trail and
 * start logging. To learn about AWS Cloud Trail and organization trail, 
 * check https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html
 */
export class OrganizationTrail extends core.Construct {

    constructor(scope: core.Construct, id: string, props: IOrganizationTrailProps) {
        super(scope, id);

        const orgTrailBucket = new Bucket(this, 'OrganizationTrailBucket', {blockPublicAccess: BlockPublicAccess.BLOCK_ALL});

        orgTrailBucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetBucketAcl'],
            effect: Effect.ALLOW,
            principals: [new ServicePrincipal('cloudtrail.amazonaws.com')],
            resources: [orgTrailBucket.bucketArn]
        }));
        
        orgTrailBucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:PutObject'],
            effect: Effect.ALLOW,
            principals: [new ServicePrincipal('cloudtrail.amazonaws.com')],
            resources: [orgTrailBucket.bucketArn + '/AWSLogs/' + props.OrganizationId + '/*'], 
            conditions: {
                StringEquals:
                {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }));

        orgTrailBucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:PutObject'],
            effect: Effect.ALLOW,
            principals: [new ServicePrincipal('cloudtrail.amazonaws.com')],
            resources: [orgTrailBucket.bucketArn + '/AWSLogs/' + core.Stack.of(this).account + '/*'], 
            conditions: {
                StringEquals:
                {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }));

        const enableAWSServiceAccess = new AwsCustomResource(this,
            "EnableAWSServiceAccess",
            {
                onCreate: {
                    service: 'Organizations',
                    action: 'enableAWSServiceAccess', //call enableAWSServiceAcces of the Javascript SDK https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#enableAWSServiceAccess-property
                    physicalResourceId: PhysicalResourceId.of('EnableAWSServiceAccess'),
                    region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
                    parameters:
                    {
                        ServicePrincipal: 'cloudtrail.amazonaws.com',
                    }
                },
                onDelete: {
                    service: 'Organizations',
                    action: 'disableAWSServiceAccess', //call disableAWSServiceAcces of the Javascript SDK https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#disableAWSServiceAccess-property
                    region: 'us-east-1', //AWS Organizations API are only available in us-east-1 for root actions
                    parameters:
                    {
                        ServicePrincipal: 'cloudtrail.amazonaws.com',
                    }
                },
                installLatestAwsSdk: false,
                policy: AwsCustomResourcePolicy.fromSdkCalls(
                    {
                        resources: AwsCustomResourcePolicy.ANY_RESOURCE
                    }
                )
            }
        );

        const organizationTrailName = 'OrganizationTrail';

        let organizationTrailCreate = new AwsCustomResource(this,
            "OrganizationTrailCreate",
            {
                onCreate: {
                    service: 'CloudTrail',
                    action: 'createTrail', //call createTrail of the Javascript SDK https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html#createTrail-property
                    physicalResourceId: PhysicalResourceId.of('OrganizationTrailCreate'),
                    parameters:
                    {
                        IsMultiRegionTrail: true,
                        IsOrganizationTrail: true,
                        Name: organizationTrailName,
                        S3BucketName: orgTrailBucket.bucketName
                    }
                },
                onDelete: {
                    service: 'CloudTrail',
                    action: 'deleteTrail', //call deleteTrail of the Javascript SDK https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html#deleteTrail-property
                    parameters: 
                    {
                        Name: organizationTrailName
                    }

                },
                installLatestAwsSdk: false,
                policy: AwsCustomResourcePolicy.fromSdkCalls(
                    {
                        resources: AwsCustomResourcePolicy.ANY_RESOURCE
                    }
                )
            }
        );
        organizationTrailCreate.node.addDependency(enableAWSServiceAccess);
        // need to add an explicit dependency on the bucket policy to avoid the creation of the trail before the policy is set up
        if(orgTrailBucket.policy)
        {
            organizationTrailCreate.node.addDependency(orgTrailBucket.policy);
        }
                        
        organizationTrailCreate.grantPrincipal.addToPrincipalPolicy(PolicyStatement.fromJson(
            {
                "Effect": "Allow",
                "Action": [
                    "iam:GetRole",
                    "organizations:EnableAWSServiceAccess",
                    "organizations:ListAccounts",
                    "iam:CreateServiceLinkedRole",
                    "organizations:DisableAWSServiceAccess",
                    "organizations:DescribeOrganization",
                    "organizations:ListAWSServiceAccessForOrganization"
                ],
                "Resource": "*"
            }
        ));

        new AwsCustomResource(this,
            "OrganizationTrailStartLogging",
            {
                onCreate: {
                    service: 'CloudTrail',
                    action: 'startLogging', //call startLogging of the Javascript SDK https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html#startLogging-property
                    physicalResourceId: PhysicalResourceId.of('OrganizationTrailStartLogging'),
                    parameters:
                    {
                        Name: organizationTrailName
                    }
                },
                onDelete: {
                    service: 'CloudTrail',
                    action: 'stopLogging', //call stopLogging of the Javascript SDK https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html#stopLogging-property
                    physicalResourceId: PhysicalResourceId.of('OrganizationTrailStartLogging'),
                    parameters:
                    {
                        Name: organizationTrailName
                    }
                },
                installLatestAwsSdk: false,
                policy: AwsCustomResourcePolicy.fromSdkCalls(
                    {
                        resources: AwsCustomResourcePolicy.ANY_RESOURCE
                    }
                )
            }
        );
    }
}