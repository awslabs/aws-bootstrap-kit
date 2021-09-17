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

import "@aws-cdk/assert/jest";
import { CrossAccountDNSDelegator } from "../lib/dns/cross-account-dns-delegator";
import { Stack } from "@aws-cdk/core";

test("subdomain created", () => {
  const stack = new Stack();
  new CrossAccountDNSDelegator(stack, "myAccount", {
    zoneName: "appsubdomain.stagesubdomain.mydomain.com",
  });

  expect(stack).toHaveResource("AWS::Route53::HostedZone",{
    Name: "appsubdomain.stagesubdomain.mydomain.com."
  });

  expect(stack).toHaveResource("Custom::CrossAccountZoneDelegationRecord",{
    recordName: "appsubdomain.stagesubdomain.mydomain.com"
  });
  
});
