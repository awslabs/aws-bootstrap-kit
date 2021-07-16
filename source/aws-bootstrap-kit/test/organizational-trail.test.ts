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

import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { OrganizationTrail } from "../lib/organization-trail";
import { Stack } from "@aws-cdk/core";

test("OrganizationTrail creation", () => {
  const stack = new Stack();
  new OrganizationTrail(stack, "OrganizationTrail", {OrganizationId: 'o-111111'});

  expectCDK(stack).to(
    haveResource("AWS::S3::Bucket", {
        PublicAccessBlockConfiguration: {
          "BlockPublicAcls": true,
          "BlockPublicPolicy": true,
          "IgnorePublicAcls": true,
          "RestrictPublicBuckets": true
        }
        
    })
  );

  expectCDK(stack).to(
    haveResource("AWS::S3::BucketPolicy", {
        Bucket: {
            "Ref": "OrganizationTrailOrganizationTrailBucket31446F20"
          },
          PolicyDocument: {
            "Statement": [
              {
                "Action": "s3:GetBucketAcl",
                "Effect": "Allow",
                "Principal": {
                  "Service": "cloudtrail.amazonaws.com"
                },
                "Resource": {
                  "Fn::GetAtt": [
                    "OrganizationTrailOrganizationTrailBucket31446F20",
                    "Arn"
                  ]
                }
              },
              {
                "Action": "s3:PutObject",
                "Condition": {
                  "StringEquals": {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                  }
                },
                "Effect": "Allow",
                "Principal": {
                  "Service": "cloudtrail.amazonaws.com"
                },
                "Resource": {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "OrganizationTrailOrganizationTrailBucket31446F20",
                          "Arn"
                        ]
                      },
                      "/AWSLogs/o-111111/*"
                    ]
                  ]
                }
              },
              {
                "Action": "s3:PutObject",
                "Condition": {
                  "StringEquals": {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                  }
                },
                "Effect": "Allow",
                "Principal": {
                  "Service": "cloudtrail.amazonaws.com"
                },
                "Resource": {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "OrganizationTrailOrganizationTrailBucket31446F20",
                          "Arn"
                        ]
                      },
                      "/AWSLogs/",
                      {
                        "Ref": "AWS::AccountId"
                      },
                      "/*"
                    ]
                  ]
                }
              }
            ],
            "Version": "2012-10-17"
          }
        
    })
  );

  expectCDK(stack).to(
    haveResource("Custom::AWS", {
        Create: JSON.stringify({
            "service": "Organizations",
            "action": "enableAWSServiceAccess",
            "physicalResourceId": {
              "id": "EnableAWSServiceAccess"
            },
            "region": "us-east-1",
            "parameters": {
              "ServicePrincipal": "cloudtrail.amazonaws.com"
            }
          }),
          Delete: JSON.stringify({
            "service": "Organizations",
            "action": "disableAWSServiceAccess",
            "region": "us-east-1",
            "parameters": {
              "ServicePrincipal": "cloudtrail.amazonaws.com"
            }
          })
    })
  );

  expectCDK(stack).to(
    haveResource("Custom::AWS", {
        Create:  {
          "Fn::Join": [
            "",
            [
              "{\"service\":\"CloudTrail\",\"action\":\"createTrail\",\"physicalResourceId\":{\"id\":\"OrganizationTrailCreate\"},\"parameters\":{\"IsMultiRegionTrail\":true,\"IsOrganizationTrail\":true,\"Name\":\"OrganizationTrail\",\"S3BucketName\":\"",
              {
                "Ref": "OrganizationTrailOrganizationTrailBucket31446F20"
              },
              "\"}}"
            ]
          ]
        },
          Delete: JSON.stringify({
            "service": "CloudTrail",
            "action": "deleteTrail",
            "parameters": {
              "Name": "OrganizationTrail"
            }
          })
    })
  );  

  expectCDK(stack).to(
    haveResource("Custom::AWS", {
        Create: "{\"service\":\"CloudTrail\",\"action\":\"startLogging\",\"physicalResourceId\":{\"id\":\"OrganizationTrailStartLogging\"},\"parameters\":{\"Name\":\"OrganizationTrail\"}}",
        Delete: "{\"service\":\"CloudTrail\",\"action\":\"stopLogging\",\"physicalResourceId\":{\"id\":\"OrganizationTrailStartLogging\"},\"parameters\":{\"Name\":\"OrganizationTrail\"}}"
    })
  );
});
