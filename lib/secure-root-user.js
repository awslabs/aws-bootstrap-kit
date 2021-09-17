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
exports.SecureRootUser = void 0;
const core = require("@aws-cdk/core");
const config = require("@aws-cdk/aws-config");
const sns = require("@aws-cdk/aws-sns");
const subs = require("@aws-cdk/aws-sns-subscriptions");
const aws_config_recorder_1 = require("./aws-config-recorder");
const iam = require("@aws-cdk/aws-iam");
class SecureRootUser extends core.Construct {
    constructor(scope, id, notificationEmail) {
        super(scope, id);
        // Build notification topic
        const secureRootUserConfigTopic = new sns.Topic(this, 'SecureRootUserConfigTopic');
        secureRootUserConfigTopic.addSubscription(new subs.EmailSubscription(notificationEmail));
        // Enforce MFA
        const configRecorder = new aws_config_recorder_1.ConfigRecorder(this, "ConfigRecorder");
        const enforceMFARule = new config.ManagedRule(this, "EnableRootMfa", {
            identifier: "ROOT_ACCOUNT_MFA_ENABLED",
            maximumExecutionFrequency: config.MaximumExecutionFrequency.TWENTY_FOUR_HOURS,
        });
        // Enforce No root access key
        const enforceNoAccessKeyRule = new config.ManagedRule(this, "NoRootAccessKey", {
            identifier: "IAM_ROOT_ACCESS_KEY_CHECK",
            maximumExecutionFrequency: config.MaximumExecutionFrequency.TWENTY_FOUR_HOURS,
        });
        // Create role used for auto remediation
        const autoRemediationRole = new iam.Role(this, 'AutoRemediationRole', {
            assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal("events.amazonaws.com"), new iam.ServicePrincipal("ssm.amazonaws.com"))
        });
        enforceMFARule.node.addDependency(configRecorder);
        enforceNoAccessKeyRule.node.addDependency(configRecorder);
        secureRootUserConfigTopic.grantPublish(autoRemediationRole);
        // Create remediations by notifying owner
        const mfaRemediationInstructionMessage = `Your main account (${core.Stack.of(this).account}) root user still not have MFA activated.\n\t1. Go to https://signin.aws.amazon.com/console and sign in using your root account\n\t2. Go to https://console.aws.amazon.com/iam/home#/security_credentials\n\t3. Activate MFA`;
        this.addNotCompliancyNotificationMechanism(enforceMFARule, autoRemediationRole, secureRootUserConfigTopic, mfaRemediationInstructionMessage);
        const accessKeyRemediationInstructionMessage = `Your main account (${core.Stack.of(this).account}) root user have static access keys.\n\t1. Go to https://signin.aws.amazon.com/console and sign in using your root account\n\t2. Go to https://console.aws.amazon.com/iam/home#/security_credentials\n\t3. Delete your Access keys`;
        this.addNotCompliancyNotificationMechanism(enforceNoAccessKeyRule, autoRemediationRole, secureRootUserConfigTopic, accessKeyRemediationInstructionMessage);
    }
    addNotCompliancyNotificationMechanism(enforceMFARule, autoRemediationRole, secureRootUserConfigTopic, message) {
        new config.CfnRemediationConfiguration(this, `Notification-${enforceMFARule.node.id}`, {
            configRuleName: enforceMFARule.configRuleName,
            targetId: "AWS-PublishSNSNotification",
            targetType: "SSM_DOCUMENT",
            targetVersion: "1",
            automatic: true,
            maximumAutomaticAttempts: 1,
            retryAttemptSeconds: 60,
            parameters: {
                AutomationAssumeRole: {
                    StaticValue: {
                        Values: [
                            autoRemediationRole.roleArn
                        ]
                    }
                },
                TopicArn: {
                    StaticValue: {
                        Values: [
                            secureRootUserConfigTopic.topicArn
                        ]
                    }
                },
                Message: {
                    StaticValue: {
                        Values: [
                            // WARNING: Limited to 256 char
                            message
                        ]
                    }
                }
            }
        });
    }
}
exports.SecureRootUser = SecureRootUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJlLXJvb3QtdXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlY3VyZS1yb290LXVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOzs7QUFFRixzQ0FBc0M7QUFDdEMsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx1REFBdUQ7QUFDdkQsK0RBQXFEO0FBQ3JELHdDQUF3QztBQUd4QyxNQUFhLGNBQWUsU0FBUSxJQUFJLENBQUMsU0FBUztJQUNoRCxZQUFZLEtBQXFCLEVBQUUsRUFBVSxFQUFFLGlCQUF5QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLDJCQUEyQjtRQUMzQixNQUFNLHlCQUF5QixHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUNuRix5QkFBeUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBR3pGLGNBQWM7UUFDZCxNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDbkUsVUFBVSxFQUFFLDBCQUEwQjtZQUN0Qyx5QkFBeUIsRUFDekIsTUFBTSxDQUFDLHlCQUF5QixDQUFDLGlCQUFpQjtTQUNuRCxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQ25ELElBQUksRUFDSixpQkFBaUIsRUFDakI7WUFDRSxVQUFVLEVBQUUsMkJBQTJCO1lBQ3ZDLHlCQUF5QixFQUN6QixNQUFNLENBQUMseUJBQXlCLENBQUMsaUJBQWlCO1NBQ25ELENBQ0YsQ0FBQztRQUVGLHdDQUF3QztRQUN4QyxNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDcEUsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUNqQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxFQUNoRCxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUNoRDtTQUNGLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2xELHNCQUFzQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFMUQseUJBQXlCLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFNUQseUNBQXlDO1FBRXpDLE1BQU0sZ0NBQWdDLEdBQUcsc0JBQXNCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sOE5BQThOLENBQUM7UUFDelQsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSx5QkFBeUIsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBRTdJLE1BQU0sc0NBQXNDLEdBQUcsc0JBQXNCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sb09BQW9PLENBQUM7UUFDclUsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLHNDQUFzQyxDQUFDLENBQUM7SUFDN0osQ0FBQztJQUdPLHFDQUFxQyxDQUFDLGNBQWtDLEVBQUUsbUJBQTZCLEVBQUUseUJBQW9DLEVBQUUsT0FBZTtRQUNwSyxJQUFJLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7WUFDckYsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUFjO1lBQzdDLFFBQVEsRUFBRSw0QkFBNEI7WUFDdEMsVUFBVSxFQUFFLGNBQWM7WUFDMUIsYUFBYSxFQUFFLEdBQUc7WUFDbEIsU0FBUyxFQUFFLElBQUk7WUFDZix3QkFBd0IsRUFBRSxDQUFDO1lBQzNCLG1CQUFtQixFQUFFLEVBQUU7WUFDdkIsVUFBVSxFQUFFO2dCQUNWLG9CQUFvQixFQUFFO29CQUNwQixXQUFXLEVBQUU7d0JBQ1gsTUFBTSxFQUFFOzRCQUNOLG1CQUFtQixDQUFDLE9BQU87eUJBQzVCO3FCQUNGO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixXQUFXLEVBQUU7d0JBQ1gsTUFBTSxFQUFFOzRCQUNOLHlCQUF5QixDQUFDLFFBQVE7eUJBQ25DO3FCQUNGO2lCQUNGO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUU7d0JBQ1gsTUFBTSxFQUFFOzRCQUNOLCtCQUErQjs0QkFDL0IsT0FBTzt5QkFDUjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBdkZELHdDQXVGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSBcIkBhd3MtY2RrL2F3cy1jb25maWdcIjtcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCB7Q29uZmlnUmVjb3JkZXJ9IGZyb20gXCIuL2F3cy1jb25maWctcmVjb3JkZXJcIjtcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcblxuXG5leHBvcnQgY2xhc3MgU2VjdXJlUm9vdFVzZXIgZXh0ZW5kcyBjb3JlLkNvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb3JlLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgbm90aWZpY2F0aW9uRW1haWw6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBCdWlsZCBub3RpZmljYXRpb24gdG9waWNcbiAgICBjb25zdCBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljID0gbmV3IHNucy5Ub3BpYyh0aGlzLCAnU2VjdXJlUm9vdFVzZXJDb25maWdUb3BpYycpO1xuICAgIHNlY3VyZVJvb3RVc2VyQ29uZmlnVG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLkVtYWlsU3Vic2NyaXB0aW9uKG5vdGlmaWNhdGlvbkVtYWlsKSk7XG5cblxuICAgIC8vIEVuZm9yY2UgTUZBXG4gICAgY29uc3QgY29uZmlnUmVjb3JkZXIgPSBuZXcgQ29uZmlnUmVjb3JkZXIodGhpcywgXCJDb25maWdSZWNvcmRlclwiKTtcblxuICAgIGNvbnN0IGVuZm9yY2VNRkFSdWxlID0gbmV3IGNvbmZpZy5NYW5hZ2VkUnVsZSh0aGlzLCBcIkVuYWJsZVJvb3RNZmFcIiwge1xuICAgICAgaWRlbnRpZmllcjogXCJST09UX0FDQ09VTlRfTUZBX0VOQUJMRURcIixcbiAgICAgIG1heGltdW1FeGVjdXRpb25GcmVxdWVuY3k6XG4gICAgICBjb25maWcuTWF4aW11bUV4ZWN1dGlvbkZyZXF1ZW5jeS5UV0VOVFlfRk9VUl9IT1VSUyxcbiAgICB9KTtcblxuICAgIC8vIEVuZm9yY2UgTm8gcm9vdCBhY2Nlc3Mga2V5XG4gICAgY29uc3QgZW5mb3JjZU5vQWNjZXNzS2V5UnVsZSA9IG5ldyBjb25maWcuTWFuYWdlZFJ1bGUoXG4gICAgICB0aGlzLFxuICAgICAgXCJOb1Jvb3RBY2Nlc3NLZXlcIixcbiAgICAgIHtcbiAgICAgICAgaWRlbnRpZmllcjogXCJJQU1fUk9PVF9BQ0NFU1NfS0VZX0NIRUNLXCIsXG4gICAgICAgIG1heGltdW1FeGVjdXRpb25GcmVxdWVuY3k6XG4gICAgICAgIGNvbmZpZy5NYXhpbXVtRXhlY3V0aW9uRnJlcXVlbmN5LlRXRU5UWV9GT1VSX0hPVVJTLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBDcmVhdGUgcm9sZSB1c2VkIGZvciBhdXRvIHJlbWVkaWF0aW9uXG4gICAgY29uc3QgYXV0b1JlbWVkaWF0aW9uUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQXV0b1JlbWVkaWF0aW9uUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5Db21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKFwiZXZlbnRzLmFtYXpvbmF3cy5jb21cIiksXG4gICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKFwic3NtLmFtYXpvbmF3cy5jb21cIiksXG4gICAgICApXG4gICAgfSk7XG5cbiAgICBlbmZvcmNlTUZBUnVsZS5ub2RlLmFkZERlcGVuZGVuY3koY29uZmlnUmVjb3JkZXIpO1xuICAgIGVuZm9yY2VOb0FjY2Vzc0tleVJ1bGUubm9kZS5hZGREZXBlbmRlbmN5KGNvbmZpZ1JlY29yZGVyKTtcblxuICAgIHNlY3VyZVJvb3RVc2VyQ29uZmlnVG9waWMuZ3JhbnRQdWJsaXNoKGF1dG9SZW1lZGlhdGlvblJvbGUpO1xuXG4gICAgLy8gQ3JlYXRlIHJlbWVkaWF0aW9ucyBieSBub3RpZnlpbmcgb3duZXJcblxuICAgIGNvbnN0IG1mYVJlbWVkaWF0aW9uSW5zdHJ1Y3Rpb25NZXNzYWdlID0gYFlvdXIgbWFpbiBhY2NvdW50ICgke2NvcmUuU3RhY2sub2YodGhpcykuYWNjb3VudH0pIHJvb3QgdXNlciBzdGlsbCBub3QgaGF2ZSBNRkEgYWN0aXZhdGVkLlxcblxcdDEuIEdvIHRvIGh0dHBzOi8vc2lnbmluLmF3cy5hbWF6b24uY29tL2NvbnNvbGUgYW5kIHNpZ24gaW4gdXNpbmcgeW91ciByb290IGFjY291bnRcXG5cXHQyLiBHbyB0byBodHRwczovL2NvbnNvbGUuYXdzLmFtYXpvbi5jb20vaWFtL2hvbWUjL3NlY3VyaXR5X2NyZWRlbnRpYWxzXFxuXFx0My4gQWN0aXZhdGUgTUZBYDtcbiAgICB0aGlzLmFkZE5vdENvbXBsaWFuY3lOb3RpZmljYXRpb25NZWNoYW5pc20oZW5mb3JjZU1GQVJ1bGUsIGF1dG9SZW1lZGlhdGlvblJvbGUsIHNlY3VyZVJvb3RVc2VyQ29uZmlnVG9waWMsIG1mYVJlbWVkaWF0aW9uSW5zdHJ1Y3Rpb25NZXNzYWdlKTtcbiAgICBcbiAgICBjb25zdCBhY2Nlc3NLZXlSZW1lZGlhdGlvbkluc3RydWN0aW9uTWVzc2FnZSA9IGBZb3VyIG1haW4gYWNjb3VudCAoJHtjb3JlLlN0YWNrLm9mKHRoaXMpLmFjY291bnR9KSByb290IHVzZXIgaGF2ZSBzdGF0aWMgYWNjZXNzIGtleXMuXFxuXFx0MS4gR28gdG8gaHR0cHM6Ly9zaWduaW4uYXdzLmFtYXpvbi5jb20vY29uc29sZSBhbmQgc2lnbiBpbiB1c2luZyB5b3VyIHJvb3QgYWNjb3VudFxcblxcdDIuIEdvIHRvIGh0dHBzOi8vY29uc29sZS5hd3MuYW1hem9uLmNvbS9pYW0vaG9tZSMvc2VjdXJpdHlfY3JlZGVudGlhbHNcXG5cXHQzLiBEZWxldGUgeW91ciBBY2Nlc3Mga2V5c2A7XG4gICAgdGhpcy5hZGROb3RDb21wbGlhbmN5Tm90aWZpY2F0aW9uTWVjaGFuaXNtKGVuZm9yY2VOb0FjY2Vzc0tleVJ1bGUsIGF1dG9SZW1lZGlhdGlvblJvbGUsIHNlY3VyZVJvb3RVc2VyQ29uZmlnVG9waWMsIGFjY2Vzc0tleVJlbWVkaWF0aW9uSW5zdHJ1Y3Rpb25NZXNzYWdlKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBhZGROb3RDb21wbGlhbmN5Tm90aWZpY2F0aW9uTWVjaGFuaXNtKGVuZm9yY2VNRkFSdWxlOiBjb25maWcuTWFuYWdlZFJ1bGUsIGF1dG9SZW1lZGlhdGlvblJvbGU6IGlhbS5Sb2xlLCBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljOiBzbnMuVG9waWMsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIG5ldyBjb25maWcuQ2ZuUmVtZWRpYXRpb25Db25maWd1cmF0aW9uKHRoaXMsIGBOb3RpZmljYXRpb24tJHtlbmZvcmNlTUZBUnVsZS5ub2RlLmlkfWAsIHtcbiAgICAgIGNvbmZpZ1J1bGVOYW1lOiBlbmZvcmNlTUZBUnVsZS5jb25maWdSdWxlTmFtZSxcbiAgICAgIHRhcmdldElkOiBcIkFXUy1QdWJsaXNoU05TTm90aWZpY2F0aW9uXCIsXG4gICAgICB0YXJnZXRUeXBlOiBcIlNTTV9ET0NVTUVOVFwiLFxuICAgICAgdGFyZ2V0VmVyc2lvbjogXCIxXCIsXG4gICAgICBhdXRvbWF0aWM6IHRydWUsXG4gICAgICBtYXhpbXVtQXV0b21hdGljQXR0ZW1wdHM6IDEsXG4gICAgICByZXRyeUF0dGVtcHRTZWNvbmRzOiA2MCxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgQXV0b21hdGlvbkFzc3VtZVJvbGU6IHtcbiAgICAgICAgICBTdGF0aWNWYWx1ZToge1xuICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgIGF1dG9SZW1lZGlhdGlvblJvbGUucm9sZUFyblxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgVG9waWNBcm46IHtcbiAgICAgICAgICBTdGF0aWNWYWx1ZToge1xuICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgIHNlY3VyZVJvb3RVc2VyQ29uZmlnVG9waWMudG9waWNBcm5cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIE1lc3NhZ2U6IHtcbiAgICAgICAgICBTdGF0aWNWYWx1ZToge1xuICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgIC8vIFdBUk5JTkc6IExpbWl0ZWQgdG8gMjU2IGNoYXJcbiAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=