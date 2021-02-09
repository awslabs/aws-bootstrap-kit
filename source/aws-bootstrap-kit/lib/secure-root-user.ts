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

import * as core from "@aws-cdk/core";
import * as config from "@aws-cdk/aws-config";
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import {ConfigRecorder} from "./aws-config-recorder";
import * as iam from '@aws-cdk/aws-iam';


export class SecureRootUser extends core.Construct {
  constructor(scope: core.Construct, id: string, notificationEmail: string) {
    super(scope, id);

    // Build notification topic
    const secureRootUserConfigTopic = new sns.Topic(this, 'SecureRootUserConfigTopic');
    secureRootUserConfigTopic.addSubscription(new subs.EmailSubscription(notificationEmail));


    // Enforce MFA
    const configRecorder = new ConfigRecorder(this, "ConfigRecorder");

    const enforceMFARule = new config.ManagedRule(this, "EnableRootMfa", {
      identifier: "ROOT_ACCOUNT_MFA_ENABLED",
      maximumExecutionFrequency:
      config.MaximumExecutionFrequency.TWENTY_FOUR_HOURS,
    });

    // Enforce No root access key
    const enforceNoAccessKeyRule = new config.ManagedRule(
      this,
      "NoRootAccessKey",
      {
        identifier: "IAM_ROOT_ACCESS_KEY_CHECK",
        maximumExecutionFrequency:
        config.MaximumExecutionFrequency.TWENTY_FOUR_HOURS,
      }
    );

    // Create role used for auto remediation
    const autoRemediationRole = new iam.Role(this, 'AutoRemediationRole', {
      assumedBy: new iam.CompositePrincipal(
          new iam.ServicePrincipal("events.amazonaws.com"),
          new iam.ServicePrincipal("ssm.amazonaws.com"),
      )
    });

    autoRemediationRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonSSMAutomationRole'));

    enforceMFARule.node.addDependency(configRecorder);
    enforceNoAccessKeyRule.node.addDependency(configRecorder);

    secureRootUserConfigTopic.grantPublish(autoRemediationRole);

    // Create remediations by notifying owner

    new config.CfnRemediationConfiguration(this, "enforceMfaNotification", {
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
              "Your main account root user seems to still not have MFA activated.\n\t1. Go to https://signin.aws.amazon.com/console and sign in using your root account \n\t2. Go to https://console.aws.amazon.com/iam/home#/security_credentials\n\t3. Activate MFA"
            ]
          }
        }
      }
    });

    new config.CfnRemediationConfiguration(this, "enforceNoAccessKeyNotification", {
      configRuleName: enforceNoAccessKeyRule.configRuleName,
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
              "Your main account root user seems to have static access keys.\n\t1. Go to https://signin.aws.amazon.com/console and sign in using your root account \n\t2. Go to https://console.aws.amazon.com/iam/home#/security_credentials\n\t3. Delete your Access keys"
            ]
          }
        }
      }
    })
  }
}
