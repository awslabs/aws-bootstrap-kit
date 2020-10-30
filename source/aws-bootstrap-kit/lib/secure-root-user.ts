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
import { ConfigRecorder } from "./aws-config-recorder";


export class SecureRootUser extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);


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

    enforceMFARule.node.addDependency(configRecorder);
    enforceNoAccessKeyRule.node.addDependency(configRecorder);
  }
}
