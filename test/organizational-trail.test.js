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
const assert_1 = require("@aws-cdk/assert");
const organization_trail_1 = require("../lib/organization-trail");
const core_1 = require("@aws-cdk/core");
test("OrganizationTrail creation", () => {
    const stack = new core_1.Stack();
    new organization_trail_1.OrganizationTrail(stack, "OrganizationTrail", { OrganizationId: 'o-111111' });
    assert_1.expect(stack).to(assert_1.haveResource("AWS::S3::Bucket", {
        PublicAccessBlockConfiguration: {
            "BlockPublicAcls": true,
            "BlockPublicPolicy": true,
            "IgnorePublicAcls": true,
            "RestrictPublicBuckets": true
        }
    }));
    assert_1.expect(stack).to(assert_1.haveResource("AWS::S3::BucketPolicy", {
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
    }));
    assert_1.expect(stack).to(assert_1.haveResource("Custom::AWS", {
        Create: {
            "service": "Organizations",
            "action": "enableAWSServiceAccess",
            "physicalResourceId": {
                "id": "EnableAWSServiceAccess"
            },
            "region": "us-east-1",
            "parameters": {
                "ServicePrincipal": "cloudtrail.amazonaws.com"
            }
        },
        Delete: {
            "service": "Organizations",
            "action": "disableAWSServiceAccess",
            "region": "us-east-1",
            "parameters": {
                "ServicePrincipal": "cloudtrail.amazonaws.com"
            }
        }
    }));
    assert_1.expect(stack).to(assert_1.haveResource("Custom::AWS", {
        Create: {
            "service": "CloudTrail",
            "action": "createTrail",
            "physicalResourceId": {
                "id": "OrganizationTrailCreate"
            },
            "parameters": {
                "IsMultiRegionTrail": "TRUE:BOOLEAN",
                "IsOrganizationTrail": "TRUE:BOOLEAN",
                "Name": "OrganizationTrail",
                "S3BucketName": {
                    "Ref": "OrganizationTrailOrganizationTrailBucket31446F20"
                }
            }
        },
        Delete: {
            "service": "CloudTrail",
            "action": "deleteTrail",
            "parameters": {
                "Name": "OrganizationTrail"
            }
        }
    }));
    assert_1.expect(stack).to(assert_1.haveResource("Custom::AWS", {
        Create: {
            "service": "CloudTrail",
            "action": "startLogging",
            "physicalResourceId": {
                "id": "OrganizationTrailStartLogging"
            },
            "parameters": {
                "Name": {
                    "Fn::GetAtt": [
                        "OrganizationTrailOrganizationTrailCreate61482CB5",
                        "Name"
                    ]
                }
            }
        },
        Delete: {
            "service": "CloudTrail",
            "action": "stopLogging",
            "physicalResourceId": {
                "id": "OrganizationTrailStartLogging"
            },
            "parameters": {
                "Name": {
                    "Fn::GetAtt": [
                        "OrganizationTrailOrganizationTrailCreate61482CB5",
                        "Name"
                    ]
                }
            }
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uYWwtdHJhaWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9yZ2FuaXphdGlvbmFsLXRyYWlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOztBQUVGLDRDQUFvRTtBQUNwRSxrRUFBOEQ7QUFDOUQsd0NBQXNDO0FBRXRDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7SUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixJQUFJLHNDQUFpQixDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxFQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO0lBRWhGLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQ2pCLHFCQUFZLENBQUMsaUJBQWlCLEVBQUU7UUFDNUIsOEJBQThCLEVBQUU7WUFDOUIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsdUJBQXVCLEVBQUUsSUFBSTtTQUM5QjtLQUVKLENBQUMsQ0FDSCxDQUFDO0lBRUYsZUFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FDakIscUJBQVksQ0FBQyx1QkFBdUIsRUFBRTtRQUNsQyxNQUFNLEVBQUU7WUFDSixLQUFLLEVBQUUsa0RBQWtEO1NBQzFEO1FBQ0QsY0FBYyxFQUFFO1lBQ2QsV0FBVyxFQUFFO2dCQUNYO29CQUNFLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSxPQUFPO29CQUNqQixXQUFXLEVBQUU7d0JBQ1gsU0FBUyxFQUFFLDBCQUEwQjtxQkFDdEM7b0JBQ0QsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRTs0QkFDWixrREFBa0Q7NEJBQ2xELEtBQUs7eUJBQ047cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsUUFBUSxFQUFFLGNBQWM7b0JBQ3hC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LFlBQVk7WUFDdkIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsb0JBQW9CLEVBQUU7Z0JBQ3BCLElBQUksRUFBRSwrQkFBK0I7YUFDdEM7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFO29CQUNOLFlBQVksRUFBRTt3QkFDWixrREFBa0Q7d0JBQ2xELE1BQU07cUJBQ1A7aUJBQ0Y7YUFDRjtTQUNGO0tBQ04sQ0FBQyxDQUNILENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIGhhdmVSZXNvdXJjZSB9IGZyb20gXCJAYXdzLWNkay9hc3NlcnRcIjtcbmltcG9ydCB7IE9yZ2FuaXphdGlvblRyYWlsIH0gZnJvbSBcIi4uL2xpYi9vcmdhbml6YXRpb24tdHJhaWxcIjtcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcblxudGVzdChcIk9yZ2FuaXphdGlvblRyYWlsIGNyZWF0aW9uXCIsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgbmV3IE9yZ2FuaXphdGlvblRyYWlsKHN0YWNrLCBcIk9yZ2FuaXphdGlvblRyYWlsXCIsIHtPcmdhbml6YXRpb25JZDogJ28tMTExMTExJ30pO1xuXG4gIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgaGF2ZVJlc291cmNlKFwiQVdTOjpTMzo6QnVja2V0XCIsIHtcbiAgICAgICAgUHVibGljQWNjZXNzQmxvY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgXCJCbG9ja1B1YmxpY0FjbHNcIjogdHJ1ZSxcbiAgICAgICAgICBcIkJsb2NrUHVibGljUG9saWN5XCI6IHRydWUsXG4gICAgICAgICAgXCJJZ25vcmVQdWJsaWNBY2xzXCI6IHRydWUsXG4gICAgICAgICAgXCJSZXN0cmljdFB1YmxpY0J1Y2tldHNcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pXG4gICk7XG5cbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICBoYXZlUmVzb3VyY2UoXCJBV1M6OlMzOjpCdWNrZXRQb2xpY3lcIiwge1xuICAgICAgICBCdWNrZXQ6IHtcbiAgICAgICAgICAgIFwiUmVmXCI6IFwiT3JnYW5pemF0aW9uVHJhaWxPcmdhbml6YXRpb25UcmFpbEJ1Y2tldDMxNDQ2RjIwXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBcIlN0YXRlbWVudFwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIkFjdGlvblwiOiBcInMzOkdldEJ1Y2tldEFjbFwiLFxuICAgICAgICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIixcbiAgICAgICAgICAgICAgICBcIlByaW5jaXBhbFwiOiB7XG4gICAgICAgICAgICAgICAgICBcIlNlcnZpY2VcIjogXCJjbG91ZHRyYWlsLmFtYXpvbmF3cy5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgICAgICBcIk9yZ2FuaXphdGlvblRyYWlsT3JnYW5pemF0aW9uVHJhaWxCdWNrZXQzMTQ0NkYyMFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkFyblwiXG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJBY3Rpb25cIjogXCJzMzpQdXRPYmplY3RcIixcbiAgICAgICAgICAgICAgICBcIkNvbmRpdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICBcIlN0cmluZ0VxdWFsc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiczM6eC1hbXotYWNsXCI6IFwiYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICAgICAgICAgICAgXCJQcmluY2lwYWxcIjoge1xuICAgICAgICAgICAgICAgICAgXCJTZXJ2aWNlXCI6IFwiY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjoge1xuICAgICAgICAgICAgICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIk9yZ2FuaXphdGlvblRyYWlsT3JnYW5pemF0aW9uVHJhaWxCdWNrZXQzMTQ0NkYyMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFyblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBcIi9BV1NMb2dzL28tMTExMTExLypcIlxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJBY3Rpb25cIjogXCJzMzpQdXRPYmplY3RcIixcbiAgICAgICAgICAgICAgICBcIkNvbmRpdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICBcIlN0cmluZ0VxdWFsc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiczM6eC1hbXotYWNsXCI6IFwiYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICAgICAgICAgICAgXCJQcmluY2lwYWxcIjoge1xuICAgICAgICAgICAgICAgICAgXCJTZXJ2aWNlXCI6IFwiY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjoge1xuICAgICAgICAgICAgICAgICAgXCJGbjo6Sm9pblwiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcIk9yZ2FuaXphdGlvblRyYWlsT3JnYW5pemF0aW9uVHJhaWxCdWNrZXQzMTQ0NkYyMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFyblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBcIi9BV1NMb2dzL1wiLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiUmVmXCI6IFwiQVdTOjpBY2NvdW50SWRcIlxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXCIvKlwiXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIlZlcnNpb25cIjogXCIyMDEyLTEwLTE3XCJcbiAgICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pXG4gICk7XG5cbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICBoYXZlUmVzb3VyY2UoXCJDdXN0b206OkFXU1wiLCB7XG4gICAgICAgIENyZWF0ZToge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiT3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJlbmFibGVBV1NTZXJ2aWNlQWNjZXNzXCIsXG4gICAgICAgICAgICBcInBoeXNpY2FsUmVzb3VyY2VJZFwiOiB7XG4gICAgICAgICAgICAgIFwiaWRcIjogXCJFbmFibGVBV1NTZXJ2aWNlQWNjZXNzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlZ2lvblwiOiBcInVzLWVhc3QtMVwiLFxuICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IHtcbiAgICAgICAgICAgICAgXCJTZXJ2aWNlUHJpbmNpcGFsXCI6IFwiY2xvdWR0cmFpbC5hbWF6b25hd3MuY29tXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIERlbGV0ZToge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiT3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJkaXNhYmxlQVdTU2VydmljZUFjY2Vzc1wiLFxuICAgICAgICAgICAgXCJyZWdpb25cIjogXCJ1cy1lYXN0LTFcIixcbiAgICAgICAgICAgIFwicGFyYW1ldGVyc1wiOiB7XG4gICAgICAgICAgICAgIFwiU2VydmljZVByaW5jaXBhbFwiOiBcImNsb3VkdHJhaWwuYW1hem9uYXdzLmNvbVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICBoYXZlUmVzb3VyY2UoXCJDdXN0b206OkFXU1wiLCB7XG4gICAgICAgIENyZWF0ZToge1xuICAgICAgICAgICAgXCJzZXJ2aWNlXCI6IFwiQ2xvdWRUcmFpbFwiLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogXCJjcmVhdGVUcmFpbFwiLFxuICAgICAgICAgICAgXCJwaHlzaWNhbFJlc291cmNlSWRcIjoge1xuICAgICAgICAgICAgICBcImlkXCI6IFwiT3JnYW5pemF0aW9uVHJhaWxDcmVhdGVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicGFyYW1ldGVyc1wiOiB7XG4gICAgICAgICAgICAgIFwiSXNNdWx0aVJlZ2lvblRyYWlsXCI6IFwiVFJVRTpCT09MRUFOXCIsXG4gICAgICAgICAgICAgIFwiSXNPcmdhbml6YXRpb25UcmFpbFwiOiBcIlRSVUU6Qk9PTEVBTlwiLFxuICAgICAgICAgICAgICBcIk5hbWVcIjogXCJPcmdhbml6YXRpb25UcmFpbFwiLFxuICAgICAgICAgICAgICBcIlMzQnVja2V0TmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJSZWZcIjogXCJPcmdhbml6YXRpb25UcmFpbE9yZ2FuaXphdGlvblRyYWlsQnVja2V0MzE0NDZGMjBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZWxldGU6IHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcIkNsb3VkVHJhaWxcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwiZGVsZXRlVHJhaWxcIixcbiAgICAgICAgICAgIFwicGFyYW1ldGVyc1wiOiB7XG4gICAgICAgICAgICAgIFwiTmFtZVwiOiBcIk9yZ2FuaXphdGlvblRyYWlsXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgfSlcbiAgKTsgIFxuXG4gIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgaGF2ZVJlc291cmNlKFwiQ3VzdG9tOjpBV1NcIiwge1xuICAgICAgICBDcmVhdGU6IHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcIkNsb3VkVHJhaWxcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwic3RhcnRMb2dnaW5nXCIsXG4gICAgICAgICAgICBcInBoeXNpY2FsUmVzb3VyY2VJZFwiOiB7XG4gICAgICAgICAgICAgIFwiaWRcIjogXCJPcmdhbml6YXRpb25UcmFpbFN0YXJ0TG9nZ2luZ1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IHtcbiAgICAgICAgICAgICAgXCJOYW1lXCI6IHtcbiAgICAgICAgICAgICAgICBcIkZuOjpHZXRBdHRcIjogW1xuICAgICAgICAgICAgICAgICAgXCJPcmdhbml6YXRpb25UcmFpbE9yZ2FuaXphdGlvblRyYWlsQ3JlYXRlNjE0ODJDQjVcIixcbiAgICAgICAgICAgICAgICAgIFwiTmFtZVwiXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZWxldGU6IHtcbiAgICAgICAgICAgIFwic2VydmljZVwiOiBcIkNsb3VkVHJhaWxcIixcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IFwic3RvcExvZ2dpbmdcIixcbiAgICAgICAgICAgIFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6IHtcbiAgICAgICAgICAgICAgXCJpZFwiOiBcIk9yZ2FuaXphdGlvblRyYWlsU3RhcnRMb2dnaW5nXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInBhcmFtZXRlcnNcIjoge1xuICAgICAgICAgICAgICBcIk5hbWVcIjoge1xuICAgICAgICAgICAgICAgIFwiRm46OkdldEF0dFwiOiBbXG4gICAgICAgICAgICAgICAgICBcIk9yZ2FuaXphdGlvblRyYWlsT3JnYW5pemF0aW9uVHJhaWxDcmVhdGU2MTQ4MkNCNVwiLFxuICAgICAgICAgICAgICAgICAgXCJOYW1lXCJcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgfSlcbiAgKTtcbn0pO1xuIl19