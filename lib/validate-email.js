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
exports.ValidateEmail = void 0;
const core_1 = require("@aws-cdk/core");
const validate_email_provider_1 = require("./validate-email-provider");
/**
 * Email Validation.
 */
class ValidateEmail extends core_1.Construct {
    /**
     * Constructor.
     *
     * @param scope The parent Construct instantiating this construct.
     * @param id This instance name.
     */
    constructor(scope, id, props) {
        super(scope, id);
        const [prefix, domain] = props.email.split("@");
        if (prefix === null || prefix === void 0 ? void 0 : prefix.includes("+")) {
            throw new Error("Root Email should be without + in it");
        }
        const subAddressedEmail = prefix + "+aws@" + domain;
        const { provider } = validate_email_provider_1.default.getOrCreate(this, { timeout: props.timeout });
        new core_1.CustomResource(this, "EmailValidateResource", {
            serviceToken: provider.serviceToken,
            resourceType: "Custom::EmailValidation",
            properties: {
                email: subAddressedEmail
            }
        });
    }
}
exports.ValidateEmail = ValidateEmail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZW1haWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWxpZGF0ZS1lbWFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7OztBQUVGLHdDQUFvRTtBQUNwRSx1RUFBOEQ7Ozs7QUFnQjlELE1BQWEsYUFBYyxTQUFRLGdCQUFTOzs7Ozs7O0lBUTFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhELElBQUksTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFFBQVEsQ0FBQyxHQUFHLEdBQUc7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUVwRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsaUNBQXFCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUV2RixJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ2hELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtZQUNuQyxZQUFZLEVBQUUseUJBQXlCO1lBQ3ZDLFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsaUJBQWlCO2FBQ3pCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBN0JELHNDQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCB7IENvbnN0cnVjdCwgQ3VzdG9tUmVzb3VyY2UsIER1cmF0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCBWYWxpZGF0ZUVtYWlsUHJvdmlkZXIgZnJvbSBcIi4vdmFsaWRhdGUtZW1haWwtcHJvdmlkZXJcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdGVFbWFpbFByb3BzIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gIHJlYWRvbmx5IGVtYWlsOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcbn1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5leHBvcnQgY2xhc3MgVmFsaWRhdGVFbWFpbCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVmFsaWRhdGVFbWFpbFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IFtwcmVmaXgsIGRvbWFpbl0gPSBwcm9wcy5lbWFpbC5zcGxpdChcIkBcIik7XG5cbiAgICBpZiAocHJlZml4Py5pbmNsdWRlcyhcIitcIikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlJvb3QgRW1haWwgc2hvdWxkIGJlIHdpdGhvdXQgKyBpbiBpdFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJBZGRyZXNzZWRFbWFpbCA9IHByZWZpeCArIFwiK2F3c0BcIiArIGRvbWFpbjtcblxuICAgIGNvbnN0IHsgcHJvdmlkZXIgfSA9IFZhbGlkYXRlRW1haWxQcm92aWRlci5nZXRPckNyZWF0ZSh0aGlzLCB7dGltZW91dDogcHJvcHMudGltZW91dH0pO1xuXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsIFwiRW1haWxWYWxpZGF0ZVJlc291cmNlXCIsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgcmVzb3VyY2VUeXBlOiBcIkN1c3RvbTo6RW1haWxWYWxpZGF0aW9uXCIsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGVtYWlsOiBzdWJBZGRyZXNzZWRFbWFpbFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=