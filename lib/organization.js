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
exports.Organization = void 0;
const core = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
const aws_iam_1 = require("@aws-cdk/aws-iam");
/**
 * This represents an Organization
 */
class Organization extends core.Construct {
    constructor(scope, id) {
        super(scope, id);
        let org = new cr.AwsCustomResource(this, "orgCustomResource", {
            onCreate: {
                service: 'Organizations',
                action: 'createOrganization',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('Organization.Id'),
                region: 'us-east-1' //AWS Organizations API are only available in us-east-1 for root actions
            },
            onUpdate: {
                service: 'Organizations',
                action: 'describeOrganization',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('Organization.Id'),
                region: 'us-east-1' //AWS Organizations API are only available in us-east-1 for root actions
            },
            onDelete: {
                service: 'Organizations',
                action: 'deleteOrganization',
                region: 'us-east-1' //AWS Organizations API are only available in us-east-1 for root actions
            },
            installLatestAwsSdk: false,
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
        /*the lambda needs to have the iam:CreateServiceLinkedRole permission so that the AWS Organizations service can create
        Service Linked Role on its behalf
        */
        org.grantPrincipal.addToPrincipalPolicy(aws_iam_1.PolicyStatement.fromJson({
            "Sid": "CreateServiceLinkedRoleStatement",
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "arn:aws:iam::*:role/*",
        }));
        this.id = org.getResponseField('Organization.Id');
        let root = new cr.AwsCustomResource(this, "RootCustomResource", {
            onCreate: {
                service: 'Organizations',
                action: 'listRoots',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('Roots.0.Id'),
                region: 'us-east-1',
            },
            onUpdate: {
                service: 'Organizations',
                action: 'listRoots',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('Roots.0.Id'),
                region: 'us-east-1',
            },
            onDelete: {
                service: 'Organizations',
                action: 'listRoots',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('Roots.0.Id'),
                region: 'us-east-1',
            },
            installLatestAwsSdk: false,
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
        // Enabling SSM AWS Service access to be able to register delegated adminstrator
        const enableSSMAWSServiceAccess = this.enableAWSServiceAccess('ssm.amazonaws.com');
        const enableMultiAccountsSetupAWSServiceAccess = this.enableAWSServiceAccess('config-multiaccountsetup.amazonaws.com');
        enableMultiAccountsSetupAWSServiceAccess.node.addDependency(org);
        enableSSMAWSServiceAccess.node.addDependency(enableMultiAccountsSetupAWSServiceAccess);
        //adding an explicit dependency as CloudFormation won't infer that calling listRoots must be done only when Organization creation is finished as there is no implicit dependency between the 
        //2 custom resources 
        root.node.addDependency(org);
        this.rootId = root.getResponseField("Roots.0.Id");
    }
    enableAWSServiceAccess(principal) {
        const resourceName = principal === 'ssm.amazonaws.com' ? "EnableSSMAWSServiceAccess" : "EnableMultiAccountsSetup";
        return new cr.AwsCustomResource(this, resourceName, {
            onCreate: {
                service: 'Organizations',
                action: 'enableAWSServiceAccess',
                physicalResourceId: cr.PhysicalResourceId.of(resourceName),
                region: 'us-east-1',
                parameters: {
                    ServicePrincipal: principal,
                }
            },
            onDelete: {
                service: 'Organizations',
                action: 'disableAWSServiceAccess',
                region: 'us-east-1',
                parameters: {
                    ServicePrincipal: principal,
                }
            },
            installLatestAwsSdk: false,
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
    }
}
exports.Organization = Organization;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JnYW5pemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7O0FBRUYsc0NBQXNDO0FBQ3RDLGdEQUFnRDtBQUNoRCw4Q0FBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxJQUFJLENBQUMsU0FBUztJQVk1QyxZQUFZLEtBQXFCLEVBQUUsRUFBVTtRQUN6QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRWhCLElBQUksR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFDbkMsbUJBQW1CLEVBQ25CO1lBQ0UsUUFBUSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxlQUFlO2dCQUN4QixNQUFNLEVBQUUsb0JBQW9CO2dCQUM1QixrQkFBa0IsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO2dCQUN6RSxNQUFNLEVBQUUsV0FBVyxDQUFDLHdFQUF3RTthQUM3RjtZQUNELFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUUsZUFBZTtnQkFDeEIsTUFBTSxFQUFFLHNCQUFzQjtnQkFDOUIsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQztnQkFDekUsTUFBTSxFQUFFLFdBQVcsQ0FBQyx3RUFBd0U7YUFDN0Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLE1BQU0sRUFBRSxvQkFBb0I7Z0JBQzVCLE1BQU0sRUFBRSxXQUFXLENBQUMsd0VBQXdFO2FBQzdGO1lBQ0QsbUJBQW1CLEVBQUUsS0FBSztZQUMxQixNQUFNLEVBQUUsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FDN0M7Z0JBQ0UsU0FBUyxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZO2FB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UztpQkFDNUI7YUFDRjtZQUNELG1CQUFtQixFQUFFLEtBQUs7WUFDMUIsTUFBTSxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQzdDO2dCQUNFLFNBQVMsRUFBRSxFQUFFLENBQUMsdUJBQXVCLENBQUMsWUFBWTthQUNuRCxDQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBdElELG9DQXNJQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7UG9saWN5U3RhdGVtZW50fSAgZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cbi8qKlxuICogVGhpcyByZXByZXNlbnRzIGFuIE9yZ2FuaXphdGlvblxuICovXG5leHBvcnQgY2xhc3MgT3JnYW5pemF0aW9uIGV4dGVuZHMgY29yZS5Db25zdHJ1Y3Qge1xuXG4gICAgLyoqXG4gICAgICogVGhlIElkIG9mIHRoZSBPcmdhbml6YXRpb25cbiAgICAgKi9cbiAgICByZWFkb25seSBpZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIElkIG9mIHRoZSByb290IE9yZ2FuaXphdGlvbmFsIFVuaXQgb2YgdGhlIE9yZ2FuaXphdGlvblxuICAgICAqL1xuICAgIHJlYWRvbmx5IHJvb3RJZDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvcmUuQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZClcblxuICAgICAgICBsZXQgb3JnID0gbmV3IGNyLkF3c0N1c3RvbVJlc291cmNlKHRoaXMsIFxuICAgICAgICAgICAgXCJvcmdDdXN0b21SZXNvdXJjZVwiLCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlOiAnT3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnY3JlYXRlT3JnYW5pemF0aW9uJyxcbiAgICAgICAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoJ09yZ2FuaXphdGlvbi5JZCcpLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG9uVXBkYXRlOiB7XG4gICAgICAgICAgICAgICAgc2VydmljZTogJ09yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ2Rlc2NyaWJlT3JnYW5pemF0aW9uJyxcbiAgICAgICAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoJ09yZ2FuaXphdGlvbi5JZCcpLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScgLy9BV1MgT3JnYW5pemF0aW9ucyBBUEkgYXJlIG9ubHkgYXZhaWxhYmxlIGluIHVzLWVhc3QtMSBmb3Igcm9vdCBhY3Rpb25zXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG9uRGVsZXRlOiB7XG4gICAgICAgICAgICAgICAgc2VydmljZTogJ09yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ2RlbGV0ZU9yZ2FuaXphdGlvbicsXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyAvL0FXUyBPcmdhbml6YXRpb25zIEFQSSBhcmUgb25seSBhdmFpbGFibGUgaW4gdXMtZWFzdC0xIGZvciByb290IGFjdGlvbnNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgICAgICAgICAgIHBvbGljeTogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHJlc291cmNlczogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAvKnRoZSBsYW1iZGEgbmVlZHMgdG8gaGF2ZSB0aGUgaWFtOkNyZWF0ZVNlcnZpY2VMaW5rZWRSb2xlIHBlcm1pc3Npb24gc28gdGhhdCB0aGUgQVdTIE9yZ2FuaXphdGlvbnMgc2VydmljZSBjYW4gY3JlYXRlIFxuICAgICAgICAgICBTZXJ2aWNlIExpbmtlZCBSb2xlIG9uIGl0cyBiZWhhbGZcbiAgICAgICAgICAgKi9cbiAgICAgICAgICAgb3JnLmdyYW50UHJpbmNpcGFsLmFkZFRvUHJpbmNpcGFsUG9saWN5KFBvbGljeVN0YXRlbWVudC5mcm9tSnNvbihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJTaWRcIjogXCJDcmVhdGVTZXJ2aWNlTGlua2VkUm9sZVN0YXRlbWVudFwiLFxuICAgICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFwiaWFtOkNyZWF0ZVNlcnZpY2VMaW5rZWRSb2xlXCIsXG4gICAgICAgICAgICAgIFwiUmVzb3VyY2VcIjogXCJhcm46YXdzOmlhbTo6Kjpyb2xlLypcIixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHRoaXMuaWQgPSBvcmcuZ2V0UmVzcG9uc2VGaWVsZCgnT3JnYW5pemF0aW9uLklkJyk7XG5cbiAgICAgICAgICBsZXQgcm9vdCA9IG5ldyBjci5Bd3NDdXN0b21SZXNvdXJjZSh0aGlzLCBcbiAgICAgICAgICAgIFwiUm9vdEN1c3RvbVJlc291cmNlXCIsIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvbkNyZWF0ZToge1xuICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdsaXN0Um9vdHMnLFxuICAgICAgICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUm9vdHMuMC5JZCcpLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvblVwZGF0ZToge1xuICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdsaXN0Um9vdHMnLFxuICAgICAgICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUm9vdHMuMC5JZCcpLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvbkRlbGV0ZToge1xuICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdsaXN0Um9vdHMnLFxuICAgICAgICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogY3IuUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUm9vdHMuMC5JZCcpLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICAgICAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gRW5hYmxpbmcgU1NNIEFXUyBTZXJ2aWNlIGFjY2VzcyB0byBiZSBhYmxlIHRvIHJlZ2lzdGVyIGRlbGVnYXRlZCBhZG1pbnN0cmF0b3JcbiAgICAgICAgICBjb25zdCBlbmFibGVTU01BV1NTZXJ2aWNlQWNjZXNzID0gdGhpcy5lbmFibGVBV1NTZXJ2aWNlQWNjZXNzKCdzc20uYW1hem9uYXdzLmNvbScpO1xuICAgICAgICAgIGNvbnN0IGVuYWJsZU11bHRpQWNjb3VudHNTZXR1cEFXU1NlcnZpY2VBY2Nlc3MgPSB0aGlzLmVuYWJsZUFXU1NlcnZpY2VBY2Nlc3MoJ2NvbmZpZy1tdWx0aWFjY291bnRzZXR1cC5hbWF6b25hd3MuY29tJyk7XG5cbiAgICAgICAgICBlbmFibGVNdWx0aUFjY291bnRzU2V0dXBBV1NTZXJ2aWNlQWNjZXNzLm5vZGUuYWRkRGVwZW5kZW5jeShvcmcpO1xuICAgICAgICAgIGVuYWJsZVNTTUFXU1NlcnZpY2VBY2Nlc3Mubm9kZS5hZGREZXBlbmRlbmN5KGVuYWJsZU11bHRpQWNjb3VudHNTZXR1cEFXU1NlcnZpY2VBY2Nlc3MpO1xuXG4gICAgICAgICAgLy9hZGRpbmcgYW4gZXhwbGljaXQgZGVwZW5kZW5jeSBhcyBDbG91ZEZvcm1hdGlvbiB3b24ndCBpbmZlciB0aGF0IGNhbGxpbmcgbGlzdFJvb3RzIG11c3QgYmUgZG9uZSBvbmx5IHdoZW4gT3JnYW5pemF0aW9uIGNyZWF0aW9uIGlzIGZpbmlzaGVkIGFzIHRoZXJlIGlzIG5vIGltcGxpY2l0IGRlcGVuZGVuY3kgYmV0d2VlbiB0aGUgXG4gICAgICAgICAgLy8yIGN1c3RvbSByZXNvdXJjZXMgXG4gICAgICAgICAgcm9vdC5ub2RlLmFkZERlcGVuZGVuY3kob3JnKTtcblxuICAgICAgICAgIHRoaXMucm9vdElkID0gcm9vdC5nZXRSZXNwb25zZUZpZWxkKFwiUm9vdHMuMC5JZFwiKTsgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgcHJpdmF0ZSBlbmFibGVBV1NTZXJ2aWNlQWNjZXNzKHByaW5jaXBhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcHJpbmNpcGFsPT09J3NzbS5hbWF6b25hd3MuY29tJz9cIkVuYWJsZVNTTUFXU1NlcnZpY2VBY2Nlc3NcIjpcIkVuYWJsZU11bHRpQWNjb3VudHNTZXR1cFwiO1xuXG4gICAgcmV0dXJuIG5ldyBjci5Bd3NDdXN0b21SZXNvdXJjZSh0aGlzLFxuICAgICAgcmVzb3VyY2VOYW1lLFxuICAgICAge1xuICAgICAgICBvbkNyZWF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdPcmdhbml6YXRpb25zJyxcbiAgICAgICAgICBhY3Rpb246ICdlbmFibGVBV1NTZXJ2aWNlQWNjZXNzJyxcbiAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5vZihyZXNvdXJjZU5hbWUpLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgU2VydmljZVByaW5jaXBhbDogcHJpbmNpcGFsLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25EZWxldGU6IHtcbiAgICAgICAgICBzZXJ2aWNlOiAnT3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgYWN0aW9uOiAnZGlzYWJsZUFXU1NlcnZpY2VBY2Nlc3MnLFxuICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgU2VydmljZVByaW5jaXBhbDogcHJpbmNpcGFsLFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgICAgIHBvbGljeTogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJlc291cmNlczogY3IuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgKTtcbiAgfVxufSJdfQ==