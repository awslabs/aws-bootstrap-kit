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
exports.ConfigRecorder = void 0;
const cdk = require("@aws-cdk/core");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const cfg = require("@aws-cdk/aws-config");
// from https://github.com/aws-samples/aws-startup-blueprint/blob/mainline/lib/aws-config-packs.ts
class ConfigRecorder extends cdk.Construct {
    constructor(scope, id) {
        super(scope, id);
        const configBucket = new s3.Bucket(this, 'ConfigBucket', { blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL });
        configBucket.addToResourcePolicy(new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            actions: ['*'],
            principals: [new iam.AnyPrincipal()],
            resources: [configBucket.bucketArn, configBucket.arnForObjects('*')],
            conditions: {
                Bool: {
                    'aws:SecureTransport': false,
                },
            },
        }));
        // Attach AWSConfigBucketPermissionsCheck to config bucket
        configBucket.addToResourcePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('config.amazonaws.com')],
            resources: [configBucket.bucketArn],
            actions: ['s3:GetBucketAcl'],
        }));
        // Attach AWSConfigBucketDelivery to config bucket
        configBucket.addToResourcePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('config.amazonaws.com')],
            resources: [`${configBucket.bucketArn}/*`],
            actions: ['s3:PutObject'],
            conditions: {
                StringEquals: {
                    's3:x-amz-acl': 'bucket-owner-full-control',
                },
            },
        }));
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
exports.ConfigRecorder = ConfigRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWNvbmZpZy1yZWNvcmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1jb25maWctcmVjb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOzs7QUFFRixxQ0FBcUM7QUFDckMsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0QywyQ0FBMkM7QUFHM0Msa0dBQWtHO0FBQ2xHLE1BQWEsY0FBZSxTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBRWhELFlBQVksS0FBb0IsRUFBRSxFQUFVO1FBQ3pDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHakIsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsRUFBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUU5RyxZQUFZLENBQUMsbUJBQW1CLENBQzlCLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0QixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ3ZCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNkLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwRSxVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFO29CQUNKLHFCQUFxQixFQUFFLEtBQUs7aUJBQzdCO2FBQ0Y7U0FDRixDQUFDLENBQ0gsQ0FBQztRQUVGLDBEQUEwRDtRQUMxRCxZQUFZLENBQUMsbUJBQW1CLENBQzlCLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0QixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDOUQsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztZQUNuQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztTQUM3QixDQUFDLENBQ0gsQ0FBQztRQUVGLGtEQUFrRDtRQUNsRCxZQUFZLENBQUMsbUJBQW1CLENBQzlCLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0QixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDOUQsU0FBUyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsU0FBUyxJQUFJLENBQUM7WUFDMUMsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQ3pCLFVBQVUsRUFBRTtnQkFDVixZQUFZLEVBQUU7b0JBQ1osY0FBYyxFQUFFLDJCQUEyQjtpQkFDNUM7YUFDRjtTQUNGLENBQUMsQ0FDSCxDQUFDO1FBRUYsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ3hELFlBQVksRUFBRSxZQUFZLENBQUMsVUFBVTtZQUNyQyxJQUFJLEVBQUUsdUJBQXVCO1NBQzlCLENBQUMsQ0FBQztRQUlILE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDMUQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDO1lBQzNELGVBQWUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUM1RixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdkQsSUFBSSxFQUFFLHlCQUF5QjtZQUMvQixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87WUFDM0IsY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRTtvQkFDYixnQkFBZ0I7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFyRUQsd0NBcUVDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkNvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICBcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIikuXG5Zb3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNmZyBmcm9tICdAYXdzLWNkay9hd3MtY29uZmlnJztcblxuXG4vLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3Mtc2FtcGxlcy9hd3Mtc3RhcnR1cC1ibHVlcHJpbnQvYmxvYi9tYWlubGluZS9saWIvYXdzLWNvbmZpZy1wYWNrcy50c1xuZXhwb3J0IGNsYXNzIENvbmZpZ1JlY29yZGVyIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG5cblx0Y29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgXG4gICAgY29uc3QgY29uZmlnQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQ29uZmlnQnVja2V0Jywge2Jsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEx9KTtcblxuICAgIGNvbmZpZ0J1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbY29uZmlnQnVja2V0LmJ1Y2tldEFybiwgY29uZmlnQnVja2V0LmFybkZvck9iamVjdHMoJyonKV0sXG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBCb29sOiB7XG4gICAgICAgICAgICAnYXdzOlNlY3VyZVRyYW5zcG9ydCc6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gQXR0YWNoIEFXU0NvbmZpZ0J1Y2tldFBlcm1pc3Npb25zQ2hlY2sgdG8gY29uZmlnIGJ1Y2tldFxuICAgIGNvbmZpZ0J1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2NvbmZpZy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICByZXNvdXJjZXM6IFtjb25maWdCdWNrZXQuYnVja2V0QXJuXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpHZXRCdWNrZXRBY2wnXSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBBdHRhY2ggQVdTQ29uZmlnQnVja2V0RGVsaXZlcnkgdG8gY29uZmlnIGJ1Y2tldFxuICAgIGNvbmZpZ0J1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2NvbmZpZy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICByZXNvdXJjZXM6IFtgJHtjb25maWdCdWNrZXQuYnVja2V0QXJufS8qYF0sXG4gICAgICAgIGFjdGlvbnM6IFsnczM6UHV0T2JqZWN0J10sXG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICdzMzp4LWFtei1hY2wnOiAnYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBuZXcgY2ZnLkNmbkRlbGl2ZXJ5Q2hhbm5lbCh0aGlzLCAnQ29uZmlnRGVsaXZlcnlDaGFubmVsJywge1xuICAgICAgczNCdWNrZXROYW1lOiBjb25maWdCdWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIG5hbWU6IFwiQ29uZmlnRGVsaXZlcnlDaGFubmVsXCJcbiAgICB9KTtcblxuXG5cbiAgICBjb25zdCBjb25maWdSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdDb25maWdSZWNvcmRlclJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY29uZmlnLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW2lhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FXU0NvbmZpZ1JvbGUnKV1cbiAgICB9KTsgICAgXG5cbiAgICBuZXcgY2ZnLkNmbkNvbmZpZ3VyYXRpb25SZWNvcmRlcih0aGlzLCAnQ29uZmlnUmVjb3JkZXInLCB7XG4gICAgICBuYW1lOiBcIkJsdWVwcmludENvbmZpZ1JlY29yZGVyXCIsXG4gICAgICByb2xlQXJuOiBjb25maWdSb2xlLnJvbGVBcm4sXG4gICAgICByZWNvcmRpbmdHcm91cDoge1xuICAgICAgICByZXNvdXJjZVR5cGVzOiBbXG4gICAgICAgICAgXCJBV1M6OklBTTo6VXNlclwiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSJdfQ==