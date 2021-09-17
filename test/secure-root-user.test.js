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
const core_1 = require("@aws-cdk/core");
const secure_root_user_1 = require("../lib/secure-root-user");
test("Get 2FA and Access key rules", () => {
    const stack = new core_1.Stack();
    new secure_root_user_1.SecureRootUser(stack, "secureRootUser", 'test@amazon.com');
    assert_1.expect(stack).to(assert_1.haveResource("AWS::Config::ConfigRule", {
        Source: {
            Owner: "AWS",
            SourceIdentifier: 'ROOT_ACCOUNT_MFA_ENABLED'
        }
    }));
    assert_1.expect(stack).to(assert_1.haveResource("AWS::Config::ConfigRule", {
        Source: {
            Owner: "AWS",
            SourceIdentifier: 'IAM_ROOT_ACCESS_KEY_CHECK'
        }
    }));
    assert_1.expect(stack).to(assert_1.haveResource("AWS::SNS::Topic"));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJlLXJvb3QtdXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjdXJlLXJvb3QtdXNlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7QUFFRiw0Q0FBa0U7QUFDbEUsd0NBQW9DO0FBQ3BDLDhEQUF1RDtBQUV2RCxJQUFJLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFMUIsSUFBSSxpQ0FBYyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBRS9ELGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQ2pCLHFCQUFZLENBQUMseUJBQXlCLEVBQUU7UUFDdEMsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFLEtBQUs7WUFDWixnQkFBZ0IsRUFBRSwwQkFBMEI7U0FDN0M7S0FDRixDQUFDLENBQ0gsQ0FBQztJQUNGLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQ2pCLHFCQUFZLENBQUMseUJBQXlCLEVBQUU7UUFDdEMsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFLEtBQUs7WUFDWixnQkFBZ0IsRUFBRSwyQkFBMkI7U0FDOUM7S0FDRixDQUFDLENBQ0gsQ0FBQztJQUVGLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQ2pCLHFCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FDaEMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkNvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCB7ZXhwZWN0IGFzIGV4cGVjdENESywgaGF2ZVJlc291cmNlfSBmcm9tIFwiQGF3cy1jZGsvYXNzZXJ0XCI7XG5pbXBvcnQge1N0YWNrfSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHtTZWN1cmVSb290VXNlcn0gZnJvbSBcIi4uL2xpYi9zZWN1cmUtcm9vdC11c2VyXCI7XG5cbnRlc3QoXCJHZXQgMkZBIGFuZCBBY2Nlc3Mga2V5IHJ1bGVzXCIsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBuZXcgU2VjdXJlUm9vdFVzZXIoc3RhY2ssIFwic2VjdXJlUm9vdFVzZXJcIiwgJ3Rlc3RAYW1hem9uLmNvbScpO1xuXG4gIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgaGF2ZVJlc291cmNlKFwiQVdTOjpDb25maWc6OkNvbmZpZ1J1bGVcIiwge1xuICAgICAgU291cmNlOiB7XG4gICAgICAgIE93bmVyOiBcIkFXU1wiLFxuICAgICAgICBTb3VyY2VJZGVudGlmaWVyOiAnUk9PVF9BQ0NPVU5UX01GQV9FTkFCTEVEJ1xuICAgICAgfVxuICAgIH0pXG4gICk7XG4gIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgaGF2ZVJlc291cmNlKFwiQVdTOjpDb25maWc6OkNvbmZpZ1J1bGVcIiwge1xuICAgICAgU291cmNlOiB7XG4gICAgICAgIE93bmVyOiBcIkFXU1wiLFxuICAgICAgICBTb3VyY2VJZGVudGlmaWVyOiAnSUFNX1JPT1RfQUNDRVNTX0tFWV9DSEVDSydcbiAgICAgIH1cbiAgICB9KVxuICApO1xuXG4gIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgaGF2ZVJlc291cmNlKFwiQVdTOjpTTlM6OlRvcGljXCIpXG4gICk7XG59KTtcbiJdfQ==