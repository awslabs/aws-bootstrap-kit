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
require("@aws-cdk/assert/jest");
const cross_account_dns_delegator_1 = require("../lib/dns/cross-account-dns-delegator");
const core_1 = require("@aws-cdk/core");
test("subdomain created", () => {
    const stack = new core_1.Stack();
    new cross_account_dns_delegator_1.CrossAccountDNSDelegator(stack, "myAccount", {
        zoneName: "appsubdomain.stagesubdomain.mydomain.com",
    });
    expect(stack).toHaveResource("AWS::Route53::HostedZone", {
        Name: "appsubdomain.stagesubdomain.mydomain.com."
    });
    expect(stack).toHaveResource("Custom::CrossAccountZoneDelegationRecord", {
        recordName: "appsubdomain.stagesubdomain.mydomain.com"
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtYWNjb3VudC1kbnMtZGVsZWdhdG9yLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcm9zcy1hY2NvdW50LWRucy1kZWxlZ2F0b3IudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7O0FBRUYsZ0NBQThCO0FBQzlCLHdGQUFrRjtBQUNsRix3Q0FBc0M7QUFFdEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLElBQUksc0RBQXdCLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtRQUMvQyxRQUFRLEVBQUUsMENBQTBDO0tBQ3JELENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsMEJBQTBCLEVBQUM7UUFDdEQsSUFBSSxFQUFFLDJDQUEyQztLQUNsRCxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLDBDQUEwQyxFQUFDO1FBQ3RFLFVBQVUsRUFBRSwwQ0FBMEM7S0FDdkQsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIFxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgXCJAYXdzLWNkay9hc3NlcnQvamVzdFwiO1xuaW1wb3J0IHsgQ3Jvc3NBY2NvdW50RE5TRGVsZWdhdG9yIH0gZnJvbSBcIi4uL2xpYi9kbnMvY3Jvc3MtYWNjb3VudC1kbnMtZGVsZWdhdG9yXCI7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5cbnRlc3QoXCJzdWJkb21haW4gY3JlYXRlZFwiLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIG5ldyBDcm9zc0FjY291bnRETlNEZWxlZ2F0b3Ioc3RhY2ssIFwibXlBY2NvdW50XCIsIHtcbiAgICB6b25lTmFtZTogXCJhcHBzdWJkb21haW4uc3RhZ2VzdWJkb21haW4ubXlkb21haW4uY29tXCIsXG4gIH0pO1xuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2UoXCJBV1M6OlJvdXRlNTM6Okhvc3RlZFpvbmVcIix7XG4gICAgTmFtZTogXCJhcHBzdWJkb21haW4uc3RhZ2VzdWJkb21haW4ubXlkb21haW4uY29tLlwiXG4gIH0pO1xuXG4gIGV4cGVjdChzdGFjaykudG9IYXZlUmVzb3VyY2UoXCJDdXN0b206OkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkXCIse1xuICAgIHJlY29yZE5hbWU6IFwiYXBwc3ViZG9tYWluLnN0YWdlc3ViZG9tYWluLm15ZG9tYWluLmNvbVwiXG4gIH0pO1xuICBcbn0pO1xuIl19