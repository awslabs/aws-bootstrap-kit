"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureRootUser = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
_a = JSII_RTTI_SYMBOL_1;
SecureRootUser[_a] = { fqn: "aws-bootstrap-kit.SecureRootUser", version: "0.3.9" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJlLXJvb3QtdXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlY3VyZS1yb290LXVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTtBQUVGLHNDQUFzQztBQUN0Qyw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHVEQUF1RDtBQUN2RCwrREFBcUQ7QUFDckQsd0NBQXdDO0FBR3hDLE1BQWEsY0FBZSxTQUFRLElBQUksQ0FBQyxTQUFTO0lBQ2hELFlBQVksS0FBcUIsRUFBRSxFQUFVLEVBQUUsaUJBQXlCO1FBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsMkJBQTJCO1FBQzNCLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQ25GLHlCQUF5QixDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFHekYsY0FBYztRQUNkLE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUVsRSxNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNuRSxVQUFVLEVBQUUsMEJBQTBCO1lBQ3RDLHlCQUF5QixFQUN6QixNQUFNLENBQUMseUJBQXlCLENBQUMsaUJBQWlCO1NBQ25ELENBQUMsQ0FBQztRQUVILDZCQUE2QjtRQUM3QixNQUFNLHNCQUFzQixHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FDbkQsSUFBSSxFQUNKLGlCQUFpQixFQUNqQjtZQUNFLFVBQVUsRUFBRSwyQkFBMkI7WUFDdkMseUJBQXlCLEVBQ3pCLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxpQkFBaUI7U0FDbkQsQ0FDRixDQUFDO1FBRUYsd0NBQXdDO1FBQ3hDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNwRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ2pDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLEVBQ2hELElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQ2hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEQsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUxRCx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUU1RCx5Q0FBeUM7UUFFekMsTUFBTSxnQ0FBZ0MsR0FBRyxzQkFBc0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyw4TkFBOE4sQ0FBQztRQUN6VCxJQUFJLENBQUMscUNBQXFDLENBQUMsY0FBYyxFQUFFLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFFN0ksTUFBTSxzQ0FBc0MsR0FBRyxzQkFBc0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxvT0FBb08sQ0FBQztRQUNyVSxJQUFJLENBQUMscUNBQXFDLENBQUMsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUseUJBQXlCLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztJQUM3SixDQUFDO0lBR08scUNBQXFDLENBQUMsY0FBa0MsRUFBRSxtQkFBNkIsRUFBRSx5QkFBb0MsRUFBRSxPQUFlO1FBQ3BLLElBQUksTUFBTSxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRTtZQUNyRixjQUFjLEVBQUUsY0FBYyxDQUFDLGNBQWM7WUFDN0MsUUFBUSxFQUFFLDRCQUE0QjtZQUN0QyxVQUFVLEVBQUUsY0FBYztZQUMxQixhQUFhLEVBQUUsR0FBRztZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLHdCQUF3QixFQUFFLENBQUM7WUFDM0IsbUJBQW1CLEVBQUUsRUFBRTtZQUN2QixVQUFVLEVBQUU7Z0JBQ1Ysb0JBQW9CLEVBQUU7b0JBQ3BCLFdBQVcsRUFBRTt3QkFDWCxNQUFNLEVBQUU7NEJBQ04sbUJBQW1CLENBQUMsT0FBTzt5QkFDNUI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLFdBQVcsRUFBRTt3QkFDWCxNQUFNLEVBQUU7NEJBQ04seUJBQXlCLENBQUMsUUFBUTt5QkFDbkM7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFdBQVcsRUFBRTt3QkFDWCxNQUFNLEVBQUU7NEJBQ04sK0JBQStCOzRCQUMvQixPQUFPO3lCQUNSO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDOztBQXRGSCx3Q0F1RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIikuXG5Zb3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gXCJAYXdzLWNkay9hd3MtY29uZmlnXCI7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzdWJzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQge0NvbmZpZ1JlY29yZGVyfSBmcm9tIFwiLi9hd3MtY29uZmlnLXJlY29yZGVyXCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cblxuZXhwb3J0IGNsYXNzIFNlY3VyZVJvb3RVc2VyIGV4dGVuZHMgY29yZS5Db25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY29yZS5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG5vdGlmaWNhdGlvbkVtYWlsOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gQnVpbGQgbm90aWZpY2F0aW9uIHRvcGljXG4gICAgY29uc3Qgc2VjdXJlUm9vdFVzZXJDb25maWdUb3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ1NlY3VyZVJvb3RVc2VyQ29uZmlnVG9waWMnKTtcbiAgICBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5FbWFpbFN1YnNjcmlwdGlvbihub3RpZmljYXRpb25FbWFpbCkpO1xuXG5cbiAgICAvLyBFbmZvcmNlIE1GQVxuICAgIGNvbnN0IGNvbmZpZ1JlY29yZGVyID0gbmV3IENvbmZpZ1JlY29yZGVyKHRoaXMsIFwiQ29uZmlnUmVjb3JkZXJcIik7XG5cbiAgICBjb25zdCBlbmZvcmNlTUZBUnVsZSA9IG5ldyBjb25maWcuTWFuYWdlZFJ1bGUodGhpcywgXCJFbmFibGVSb290TWZhXCIsIHtcbiAgICAgIGlkZW50aWZpZXI6IFwiUk9PVF9BQ0NPVU5UX01GQV9FTkFCTEVEXCIsXG4gICAgICBtYXhpbXVtRXhlY3V0aW9uRnJlcXVlbmN5OlxuICAgICAgY29uZmlnLk1heGltdW1FeGVjdXRpb25GcmVxdWVuY3kuVFdFTlRZX0ZPVVJfSE9VUlMsXG4gICAgfSk7XG5cbiAgICAvLyBFbmZvcmNlIE5vIHJvb3QgYWNjZXNzIGtleVxuICAgIGNvbnN0IGVuZm9yY2VOb0FjY2Vzc0tleVJ1bGUgPSBuZXcgY29uZmlnLk1hbmFnZWRSdWxlKFxuICAgICAgdGhpcyxcbiAgICAgIFwiTm9Sb290QWNjZXNzS2V5XCIsXG4gICAgICB7XG4gICAgICAgIGlkZW50aWZpZXI6IFwiSUFNX1JPT1RfQUNDRVNTX0tFWV9DSEVDS1wiLFxuICAgICAgICBtYXhpbXVtRXhlY3V0aW9uRnJlcXVlbmN5OlxuICAgICAgICBjb25maWcuTWF4aW11bUV4ZWN1dGlvbkZyZXF1ZW5jeS5UV0VOVFlfRk9VUl9IT1VSUyxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gQ3JlYXRlIHJvbGUgdXNlZCBmb3IgYXV0byByZW1lZGlhdGlvblxuICAgIGNvbnN0IGF1dG9SZW1lZGlhdGlvblJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0F1dG9SZW1lZGlhdGlvblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChcImV2ZW50cy5hbWF6b25hd3MuY29tXCIpLFxuICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChcInNzbS5hbWF6b25hd3MuY29tXCIpLFxuICAgICAgKVxuICAgIH0pO1xuXG4gICAgZW5mb3JjZU1GQVJ1bGUubm9kZS5hZGREZXBlbmRlbmN5KGNvbmZpZ1JlY29yZGVyKTtcbiAgICBlbmZvcmNlTm9BY2Nlc3NLZXlSdWxlLm5vZGUuYWRkRGVwZW5kZW5jeShjb25maWdSZWNvcmRlcik7XG5cbiAgICBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljLmdyYW50UHVibGlzaChhdXRvUmVtZWRpYXRpb25Sb2xlKTtcblxuICAgIC8vIENyZWF0ZSByZW1lZGlhdGlvbnMgYnkgbm90aWZ5aW5nIG93bmVyXG5cbiAgICBjb25zdCBtZmFSZW1lZGlhdGlvbkluc3RydWN0aW9uTWVzc2FnZSA9IGBZb3VyIG1haW4gYWNjb3VudCAoJHtjb3JlLlN0YWNrLm9mKHRoaXMpLmFjY291bnR9KSByb290IHVzZXIgc3RpbGwgbm90IGhhdmUgTUZBIGFjdGl2YXRlZC5cXG5cXHQxLiBHbyB0byBodHRwczovL3NpZ25pbi5hd3MuYW1hem9uLmNvbS9jb25zb2xlIGFuZCBzaWduIGluIHVzaW5nIHlvdXIgcm9vdCBhY2NvdW50XFxuXFx0Mi4gR28gdG8gaHR0cHM6Ly9jb25zb2xlLmF3cy5hbWF6b24uY29tL2lhbS9ob21lIy9zZWN1cml0eV9jcmVkZW50aWFsc1xcblxcdDMuIEFjdGl2YXRlIE1GQWA7XG4gICAgdGhpcy5hZGROb3RDb21wbGlhbmN5Tm90aWZpY2F0aW9uTWVjaGFuaXNtKGVuZm9yY2VNRkFSdWxlLCBhdXRvUmVtZWRpYXRpb25Sb2xlLCBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljLCBtZmFSZW1lZGlhdGlvbkluc3RydWN0aW9uTWVzc2FnZSk7XG4gICAgXG4gICAgY29uc3QgYWNjZXNzS2V5UmVtZWRpYXRpb25JbnN0cnVjdGlvbk1lc3NhZ2UgPSBgWW91ciBtYWluIGFjY291bnQgKCR7Y29yZS5TdGFjay5vZih0aGlzKS5hY2NvdW50fSkgcm9vdCB1c2VyIGhhdmUgc3RhdGljIGFjY2VzcyBrZXlzLlxcblxcdDEuIEdvIHRvIGh0dHBzOi8vc2lnbmluLmF3cy5hbWF6b24uY29tL2NvbnNvbGUgYW5kIHNpZ24gaW4gdXNpbmcgeW91ciByb290IGFjY291bnRcXG5cXHQyLiBHbyB0byBodHRwczovL2NvbnNvbGUuYXdzLmFtYXpvbi5jb20vaWFtL2hvbWUjL3NlY3VyaXR5X2NyZWRlbnRpYWxzXFxuXFx0My4gRGVsZXRlIHlvdXIgQWNjZXNzIGtleXNgO1xuICAgIHRoaXMuYWRkTm90Q29tcGxpYW5jeU5vdGlmaWNhdGlvbk1lY2hhbmlzbShlbmZvcmNlTm9BY2Nlc3NLZXlSdWxlLCBhdXRvUmVtZWRpYXRpb25Sb2xlLCBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljLCBhY2Nlc3NLZXlSZW1lZGlhdGlvbkluc3RydWN0aW9uTWVzc2FnZSk7XG4gIH1cblxuXG4gIHByaXZhdGUgYWRkTm90Q29tcGxpYW5jeU5vdGlmaWNhdGlvbk1lY2hhbmlzbShlbmZvcmNlTUZBUnVsZTogY29uZmlnLk1hbmFnZWRSdWxlLCBhdXRvUmVtZWRpYXRpb25Sb2xlOiBpYW0uUm9sZSwgc2VjdXJlUm9vdFVzZXJDb25maWdUb3BpYzogc25zLlRvcGljLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBuZXcgY29uZmlnLkNmblJlbWVkaWF0aW9uQ29uZmlndXJhdGlvbih0aGlzLCBgTm90aWZpY2F0aW9uLSR7ZW5mb3JjZU1GQVJ1bGUubm9kZS5pZH1gLCB7XG4gICAgICBjb25maWdSdWxlTmFtZTogZW5mb3JjZU1GQVJ1bGUuY29uZmlnUnVsZU5hbWUsXG4gICAgICB0YXJnZXRJZDogXCJBV1MtUHVibGlzaFNOU05vdGlmaWNhdGlvblwiLFxuICAgICAgdGFyZ2V0VHlwZTogXCJTU01fRE9DVU1FTlRcIixcbiAgICAgIHRhcmdldFZlcnNpb246IFwiMVwiLFxuICAgICAgYXV0b21hdGljOiB0cnVlLFxuICAgICAgbWF4aW11bUF1dG9tYXRpY0F0dGVtcHRzOiAxLFxuICAgICAgcmV0cnlBdHRlbXB0U2Vjb25kczogNjAsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIEF1dG9tYXRpb25Bc3N1bWVSb2xlOiB7XG4gICAgICAgICAgU3RhdGljVmFsdWU6IHtcbiAgICAgICAgICAgIFZhbHVlczogW1xuICAgICAgICAgICAgICBhdXRvUmVtZWRpYXRpb25Sb2xlLnJvbGVBcm5cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFRvcGljQXJuOiB7XG4gICAgICAgICAgU3RhdGljVmFsdWU6IHtcbiAgICAgICAgICAgIFZhbHVlczogW1xuICAgICAgICAgICAgICBzZWN1cmVSb290VXNlckNvbmZpZ1RvcGljLnRvcGljQXJuXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBNZXNzYWdlOiB7XG4gICAgICAgICAgU3RhdGljVmFsdWU6IHtcbiAgICAgICAgICAgIFZhbHVlczogW1xuICAgICAgICAgICAgICAvLyBXQVJOSU5HOiBMaW1pdGVkIHRvIDI1NiBjaGFyXG4gICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19