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
exports.OrganizationTrail = void 0;
const core = require("@aws-cdk/core");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const aws_iam_1 = require("@aws-cdk/aws-iam");
/**
 * This represents an organization trail. An organization trail logs all events for all AWS accounts in that organization
 * and write them in a dedicated S3 bucket in the master account of the organization. To deploy this construct you should
 * the credential of the master account of your organization. It deploys a S3 bucket, enables cloudtrail.amazonaws.com to
 * access the organization API, creates an organization trail and
 * start logging. To learn about AWS Cloud Trail and organization trail,
 * check https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html
 */
class OrganizationTrail extends core.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const orgTrailBucket = new aws_s3_1.Bucket(this, 'OrganizationTrailBucket', { blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL });
        orgTrailBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            actions: ['s3:GetBucketAcl'],
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.ServicePrincipal('cloudtrail.amazonaws.com')],
            resources: [orgTrailBucket.bucketArn]
        }));
        orgTrailBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            actions: ['s3:PutObject'],
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.ServicePrincipal('cloudtrail.amazonaws.com')],
            resources: [orgTrailBucket.bucketArn + '/AWSLogs/' + props.OrganizationId + '/*'],
            conditions: {
                StringEquals: {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }));
        orgTrailBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            actions: ['s3:PutObject'],
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.ServicePrincipal('cloudtrail.amazonaws.com')],
            resources: [orgTrailBucket.bucketArn + '/AWSLogs/' + core.Stack.of(this).account + '/*'],
            conditions: {
                StringEquals: {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }));
        const enableAWSServiceAccess = new custom_resources_1.AwsCustomResource(this, "EnableAWSServiceAccess", {
            onCreate: {
                service: 'Organizations',
                action: 'enableAWSServiceAccess',
                physicalResourceId: custom_resources_1.PhysicalResourceId.of('EnableAWSServiceAccess'),
                region: 'us-east-1',
                parameters: {
                    ServicePrincipal: 'cloudtrail.amazonaws.com',
                }
            },
            onDelete: {
                service: 'Organizations',
                action: 'disableAWSServiceAccess',
                region: 'us-east-1',
                parameters: {
                    ServicePrincipal: 'cloudtrail.amazonaws.com',
                }
            },
            installLatestAwsSdk: false,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
        let organizationTrailCreate = new custom_resources_1.AwsCustomResource(this, "OrganizationTrailCreate", {
            onCreate: {
                service: 'CloudTrail',
                action: 'createTrail',
                physicalResourceId: custom_resources_1.PhysicalResourceId.of('OrganizationTrailCreate'),
                parameters: {
                    IsMultiRegionTrail: true,
                    IsOrganizationTrail: true,
                    Name: 'OrganizationTrail',
                    S3BucketName: orgTrailBucket.bucketName
                }
            },
            onDelete: {
                service: 'CloudTrail',
                action: 'deleteTrail',
                parameters: {
                    Name: 'OrganizationTrail'
                }
            },
            installLatestAwsSdk: false,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
        organizationTrailCreate.node.addDependency(enableAWSServiceAccess);
        // need to add an explicit dependency on the bucket policy to avoid the creation of the trail before the policy is set up
        if (orgTrailBucket.policy) {
            organizationTrailCreate.node.addDependency(orgTrailBucket.policy);
        }
        organizationTrailCreate.grantPrincipal.addToPrincipalPolicy(aws_iam_1.PolicyStatement.fromJson({
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
        }));
        new custom_resources_1.AwsCustomResource(this, "OrganizationTrailStartLogging", {
            onCreate: {
                service: 'CloudTrail',
                action: 'startLogging',
                physicalResourceId: custom_resources_1.PhysicalResourceId.of('OrganizationTrailStartLogging'),
                parameters: {
                    Name: organizationTrailCreate.getResponseField('Name')
                }
            },
            onDelete: {
                service: 'CloudTrail',
                action: 'stopLogging',
                physicalResourceId: custom_resources_1.PhysicalResourceId.of('OrganizationTrailStartLogging'),
                parameters: {
                    Name: organizationTrailCreate.getResponseField('Name')
                }
            },
            installLatestAwsSdk: false,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                resources: custom_resources_1.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
    }
}
exports.OrganizationTrail = OrganizationTrail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLXRyYWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JnYW5pemF0aW9uLXRyYWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7O0FBRUYsc0NBQXNDO0FBQ3RDLGdFQUEyRztBQUMzRyw0Q0FBNEQ7QUFDNUQsOENBQTZFO0FBWTdFOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLGlCQUFrQixTQUFRLElBQUksQ0FBQyxTQUFTO0lBRWpELFlBQVksS0FBcUIsRUFBRSxFQUFVLEVBQUUsS0FBOEI7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLGNBQWMsR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUUsRUFBQyxpQkFBaUIsRUFBRSwwQkFBaUIsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBRXJILGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDbkQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDNUIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixVQUFVLEVBQUUsQ0FBQyxJQUFJLDBCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDOUQsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQztTQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVKLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLHlCQUFlLENBQUM7WUFDbkQsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7WUFDcEIsVUFBVSxFQUFFLENBQUMsSUFBSSwwQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQzlELFNBQVMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEdBQUcsV0FBVyxHQUFHLEtBQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxD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O2dCQUM1Qiw2QkFBNkI7Z0JBQzdCLHVDQUF1QztnQkFDdkMsb0NBQW9DO2dCQUNwQyxtREFBbUQ7YUFDdEQ7WUFDRCxVQUFVLEVBQUUsR0FBRztTQUNsQixDQUNKLENBQUMsQ0FBQztRQUVILElBQUksb0NBQWlCLENBQUMsSUFBSSxFQUN0QiwrQkFBK0IsRUFDL0I7WUFDSSxRQUFRLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixrQkFBa0IsRUFBRSxxQ0FBa0IsQ0FBQyxFQUFFLENBQUMsK0JBQStCLENBQUM7Z0JBQzFFLFVBQVUsRUFDVjtvQkFDSSxJQUFJLEVBQUUsdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO2lCQUN6RDthQUNKO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixNQUFNLEVBQUUsYUFBYTtnQkFDckIsa0JBQWtCLEVBQUUscUNBQWtCLENBQUMsRUFBRSxDQUFDLCtCQUErQixDQUFDO2dCQUMxRSxVQUFVLEVBQ1Y7b0JBQ0ksSUFBSSxFQUFFLHVCQUF1QixDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztpQkFDekQ7YUFDSjtZQUNELG1CQUFtQixFQUFFLEtBQUs7WUFDMUIsTUFBTSxFQUFFLDBDQUF1QixDQUFDLFlBQVksQ0FDeEM7Z0JBQ0ksU0FBUyxFQUFFLDBDQUF1QixDQUFDLFlBQVk7YUFDbEQsQ0FDSjtTQUNKLENBQ0osQ0FBQztJQUNOLENBQUM7Q0FDSjtBQTVKRCw4Q0E0SkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIFxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXdzQ3VzdG9tUmVzb3VyY2UsIFBoeXNpY2FsUmVzb3VyY2VJZCwgQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kgfSBmcm9tIFwiQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlc1wiO1xuaW1wb3J0IHsgQnVja2V0LCBCbG9ja1B1YmxpY0FjY2VzcyB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBFZmZlY3QsIFBvbGljeVN0YXRlbWVudCwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIG9mIGFuIE9yZ2FuaXphdGlvblRyYWlsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU9yZ2FuaXphdGlvblRyYWlsUHJvcHMge1xuICAgIC8qKlxuICAgICAqIFRoZSBJZCBvZiB0aGUgb3JnYW5pemF0aW9uIHdoaWNoIHRoZSB0cmFpbCB3b3JrcyBvblxuICAgICAqL1xuICAgIE9yZ2FuaXphdGlvbklkOiBzdHJpbmdcbn1cblxuLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYW4gb3JnYW5pemF0aW9uIHRyYWlsLiBBbiBvcmdhbml6YXRpb24gdHJhaWwgbG9ncyBhbGwgZXZlbnRzIGZvciBhbGwgQVdTIGFjY291bnRzIGluIHRoYXQgb3JnYW5pemF0aW9uIFxuICogYW5kIHdyaXRlIHRoZW0gaW4gYSBkZWRpY2F0ZWQgUzMgYnVja2V0IGluIHRoZSBtYXN0ZXIgYWNjb3VudCBvZiB0aGUgb3JnYW5pemF0aW9uLiBUbyBkZXBsb3kgdGhpcyBjb25zdHJ1Y3QgeW91IHNob3VsZFxuICogdGhlIGNyZWRlbnRpYWwgb2YgdGhlIG1hc3RlciBhY2NvdW50IG9mIHlvdXIgb3JnYW5pemF0aW9uLiBJdCBkZXBsb3lzIGEgUzMgYnVja2V0LCBlbmFibGVzIGNsb3VkdHJhaWwuYW1hem9uYXdzLmNvbSB0b1xuICogYWNjZXNzIHRoZSBvcmdhbml6YXRpb24gQVBJLCBjcmVhdGVzIGFuIG9yZ2FuaXphdGlvbiB0cmFpbCBhbmRcbiAqIHN0YXJ0IGxvZ2dpbmcuIFRvIGxlYXJuIGFib3V0IEFXUyBDbG91ZCBUcmFpbCBhbmQgb3JnYW5pemF0aW9uIHRyYWlsLCBcbiAqIGNoZWNrIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hd3NjbG91ZHRyYWlsL2xhdGVzdC91c2VyZ3VpZGUvY3JlYXRpbmctdHJhaWwtb3JnYW5pemF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIE9yZ2FuaXphdGlvblRyYWlsIGV4dGVuZHMgY29yZS5Db25zdHJ1Y3Qge1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvcmUuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSU9yZ2FuaXphdGlvblRyYWlsUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjb25zdCBvcmdUcmFpbEJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgJ09yZ2FuaXphdGlvblRyYWlsQnVja2V0Jywge2Jsb2NrUHVibGljQWNjZXNzOiBCbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEx9KTtcblxuICAgICAgICBvcmdUcmFpbEJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgYWN0aW9uczogWydzMzpHZXRCdWNrZXRBY2wnXSxcbiAgICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZHRyYWlsLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtvcmdUcmFpbEJ1Y2tldC5idWNrZXRBcm5dXG4gICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIG9yZ1RyYWlsQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkdHJhaWwuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgICAgIHJlc291cmNlczogW29yZ1RyYWlsQnVja2V0LmJ1Y2tldEFybiArICcvQVdTTG9ncy8nICsgcHJvcHMuT3JnYW5pemF0aW9uSWQgKyAnLyonXSwgXG4gICAgICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJzMzp4LWFtei1hY2xcIjogXCJidWNrZXQtb3duZXItZnVsbC1jb250cm9sXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcblxuICAgICAgICBvcmdUcmFpbEJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZHRyYWlsLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtvcmdUcmFpbEJ1Y2tldC5idWNrZXRBcm4gKyAnL0FXU0xvZ3MvJyArIGNvcmUuU3RhY2sub2YodGhpcykuYWNjb3VudCArICcvKiddLCBcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInMzOngtYW16LWFjbFwiOiBcImJ1Y2tldC1vd25lci1mdWxsLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGNvbnN0IGVuYWJsZUFXU1NlcnZpY2VBY2Nlc3MgPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2UodGhpcyxcbiAgICAgICAgICAgIFwiRW5hYmxlQVdTU2VydmljZUFjY2Vzc1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9uQ3JlYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnZW5hYmxlQVdTU2VydmljZUFjY2VzcycsIC8vY2FsbCBlbmFibGVBV1NTZXJ2aWNlQWNjZXMgb2YgdGhlIEphdmFzY3JpcHQgU0RLIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9BV1MvT3JnYW5pemF0aW9ucy5odG1sI2VuYWJsZUFXU1NlcnZpY2VBY2Nlc3MtcHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ0VuYWJsZUFXU1NlcnZpY2VBY2Nlc3MnKSxcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJywgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFNlcnZpY2VQcmluY2lwYWw6ICdjbG91ZHRyYWlsLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkRlbGV0ZToge1xuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlOiAnT3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2Rpc2FibGVBV1NTZXJ2aWNlQWNjZXNzJywgLy9jYWxsIGRpc2FibGVBV1NTZXJ2aWNlQWNjZXMgb2YgdGhlIEphdmFzY3JpcHQgU0RLIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9BV1MvT3JnYW5pemF0aW9ucy5odG1sI2Rpc2FibGVBV1NTZXJ2aWNlQWNjZXNzLXByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlUHJpbmNpcGFsOiAnY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgICAgICAgICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IG9yZ2FuaXphdGlvblRyYWlsQ3JlYXRlID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHRoaXMsXG4gICAgICAgICAgICBcIk9yZ2FuaXphdGlvblRyYWlsQ3JlYXRlXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZTogJ0Nsb3VkVHJhaWwnLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdjcmVhdGVUcmFpbCcsIC8vY2FsbCBjcmVhdGVUcmFpbCBvZiB0aGUgSmF2YXNjcmlwdCBTREsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9DbG91ZFRyYWlsLmh0bWwjY3JlYXRlVHJhaWwtcHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ09yZ2FuaXphdGlvblRyYWlsQ3JlYXRlJyksXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIElzTXVsdGlSZWdpb25UcmFpbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIElzT3JnYW5pemF0aW9uVHJhaWw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBOYW1lOiAnT3JnYW5pemF0aW9uVHJhaWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgUzNCdWNrZXROYW1lOiBvcmdUcmFpbEJ1Y2tldC5idWNrZXROYW1lXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uRGVsZXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdDbG91ZFRyYWlsJyxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnZGVsZXRlVHJhaWwnLCAvL2NhbGwgZGVsZXRlVHJhaWwgb2YgdGhlIEphdmFzY3JpcHQgU0RLIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9BV1MvQ2xvdWRUcmFpbC5odG1sI2NyZWF0ZVRyYWlsLXByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBOYW1lOiAnT3JnYW5pemF0aW9uVHJhaWwnXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgICAgICAgICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIG9yZ2FuaXphdGlvblRyYWlsQ3JlYXRlLm5vZGUuYWRkRGVwZW5kZW5jeShlbmFibGVBV1NTZXJ2aWNlQWNjZXNzKTtcbiAgICAgICAgLy8gbmVlZCB0byBhZGQgYW4gZXhwbGljaXQgZGVwZW5kZW5jeSBvbiB0aGUgYnVja2V0IHBvbGljeSB0byBhdm9pZCB0aGUgY3JlYXRpb24gb2YgdGhlIHRyYWlsIGJlZm9yZSB0aGUgcG9saWN5IGlzIHNldCB1cFxuICAgICAgICBpZihvcmdUcmFpbEJ1Y2tldC5wb2xpY3kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvblRyYWlsQ3JlYXRlLm5vZGUuYWRkRGVwZW5kZW5jeShvcmdUcmFpbEJ1Y2tldC5wb2xpY3kpO1xuICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgb3JnYW5pemF0aW9uVHJhaWxDcmVhdGUuZ3JhbnRQcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3koUG9saWN5U3RhdGVtZW50LmZyb21Kc29uKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIixcbiAgICAgICAgICAgICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiaWFtOkdldFJvbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvcmdhbml6YXRpb25zOkVuYWJsZUFXU1NlcnZpY2VBY2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvcmdhbml6YXRpb25zOkxpc3RBY2NvdW50c1wiLFxuICAgICAgICAgICAgICAgICAgICBcImlhbTpDcmVhdGVTZXJ2aWNlTGlua2VkUm9sZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm9yZ2FuaXphdGlvbnM6RGlzYWJsZUFXU1NlcnZpY2VBY2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvcmdhbml6YXRpb25zOkRlc2NyaWJlT3JnYW5pemF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwib3JnYW5pemF0aW9uczpMaXN0QVdTU2VydmljZUFjY2Vzc0Zvck9yZ2FuaXphdGlvblwiXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcIlJlc291cmNlXCI6IFwiKlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICkpO1xuXG4gICAgICAgIG5ldyBBd3NDdXN0b21SZXNvdXJjZSh0aGlzLFxuICAgICAgICAgICAgXCJPcmdhbml6YXRpb25UcmFpbFN0YXJ0TG9nZ2luZ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9uQ3JlYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdDbG91ZFRyYWlsJyxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc3RhcnRMb2dnaW5nJywgLy9jYWxsIHN0YXJ0TG9nZ2luZyBvZiB0aGUgSmF2YXNjcmlwdCBTREsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9DbG91ZFRyYWlsLmh0bWwjc3RhcnRMb2dnaW5nLXByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdPcmdhbml6YXRpb25UcmFpbFN0YXJ0TG9nZ2luZycpLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBOYW1lOiBvcmdhbml6YXRpb25UcmFpbENyZWF0ZS5nZXRSZXNwb25zZUZpZWxkKCdOYW1lJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25EZWxldGU6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZTogJ0Nsb3VkVHJhaWwnLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdzdG9wTG9nZ2luZycsIC8vY2FsbCBzdG9wTG9nZ2luZyBvZiB0aGUgSmF2YXNjcmlwdCBTREsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9DbG91ZFRyYWlsLmh0bWwjc3RvcExvZ2dpbmctcHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ09yZ2FuaXphdGlvblRyYWlsU3RhcnRMb2dnaW5nJyksXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE5hbWU6IG9yZ2FuaXphdGlvblRyYWlsQ3JlYXRlLmdldFJlc3BvbnNlRmllbGQoJ05hbWUnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyhcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59Il19