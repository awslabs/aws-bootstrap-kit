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
exports.isCompleteHandler = exports.onEventHandler = void 0;
// eslint-disable-line import/no-extraneous-dependencies
const aws_sdk_1 = require("aws-sdk");
/**
 * A function capable of creating an account into an AWS Organisation
 * @param event An event with the following ResourceProperties: Email (coresponding to the account email) and AccountName (corresponding to the account name)
 * @returns Returns a PhysicalResourceId corresponding to the CreateAccount request's id necessary to check the status of the creation
 */
async function onEventHandler(event) {
    var _a;
    console.log("Event: %j", event);
    switch (event.RequestType) {
        case "Create":
            const awsOrganizationsClient = new aws_sdk_1.Organizations({ region: 'us-east-1' });
            try {
                const tags = [];
                Object.keys(event.ResourceProperties).forEach(propertyKey => {
                    if (propertyKey != 'ServiceToken')
                        tags.push({ Key: propertyKey, Value: event.ResourceProperties[propertyKey] });
                });
                const data = await awsOrganizationsClient
                    .createAccount({
                    Email: event.ResourceProperties.Email,
                    AccountName: event.ResourceProperties.AccountName,
                    Tags: tags
                })
                    .promise();
                console.log("create account: %j", data);
                return { PhysicalResourceId: (_a = data.CreateAccountStatus) === null || _a === void 0 ? void 0 : _a.Id };
            }
            catch (error) {
                throw new Error(`Failed to create account: ${error}`);
            }
        case "Update":
            return { PhysicalResourceId: event.PhysicalResourceId, ResourceProperties: event.ResourceProperties };
        default:
            throw new Error(`${event.RequestType} is not a supported operation`);
    }
}
exports.onEventHandler = onEventHandler;
/**
 * A function capable to check if an account creation request has been completed
 * @param event An event containing a PhysicalResourceId corresponding to a CreateAccountRequestId
 * @returns A payload containing the IsComplete Flag requested by cdk Custom Resource fwk to figure out if the resource has been created or failed to be or if it needs to retry
 */
async function isCompleteHandler(event) {
    var _a, _b;
    console.log("Event: %j", event);
    if (!event.PhysicalResourceId) {
        throw new Error("Missing PhysicalResourceId parameter.");
    }
    const awsOrganizationsClient = new aws_sdk_1.Organizations({ region: 'us-east-1' });
    const describeCreateAccountStatusParams = { CreateAccountRequestId: event.PhysicalResourceId };
    const data = await awsOrganizationsClient
        .describeCreateAccountStatus(describeCreateAccountStatusParams).promise();
    console.log("Describe account: %j", data);
    const CreateAccountStatus = (_a = data.CreateAccountStatus) === null || _a === void 0 ? void 0 : _a.State;
    const AccountId = (_b = data.CreateAccountStatus) === null || _b === void 0 ? void 0 : _b.AccountId;
    switch (event.RequestType) {
        case "Create":
            return { IsComplete: CreateAccountStatus === "SUCCEEDED", Data: { AccountId: AccountId } };
        case "Update":
            if (AccountId) {
                console.log(`Add tags: type = ${event.ResourceProperties.AccountType}`);
                const tags = [];
                Object.keys(event.ResourceProperties).forEach(propertyKey => {
                    if (propertyKey != 'ServiceToken')
                        tags.push({ Key: propertyKey, Value: event.ResourceProperties[propertyKey] });
                });
                const tagsUpdateRequestData = await awsOrganizationsClient
                    .tagResource({
                    ResourceId: AccountId,
                    Tags: tags
                })
                    .promise();
                console.log("Updated account tags: %j", tagsUpdateRequestData);
            }
            return { IsComplete: CreateAccountStatus === "SUCCEEDED", Data: { AccountId: AccountId } };
        case "Delete":
            // TODO: figure out what to do here
            throw new Error("DeleteAccount is not a supported operation");
    }
}
exports.isCompleteHandler = isCompleteHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7OztBQVNGLHdEQUF3RDtBQUN4RCxxQ0FBd0M7QUFHeEM7Ozs7R0FJRztBQUVJLEtBQUssVUFBVSxjQUFjLENBQ2xDLEtBQVU7O0lBRVYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUTtZQUNYLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSx1QkFBYSxDQUFDLEVBQUMsTUFBTSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7WUFDeEUsSUFBSTtnQkFDRixNQUFNLElBQUksR0FBbUMsRUFBRSxDQUFDO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxXQUFXLENBQUMsRUFBRTtvQkFDM0QsSUFBSSxXQUFXLElBQUksY0FBYzt3QkFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDbEgsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxzQkFBc0I7cUJBQ3hDLGFBQWEsQ0FBQztvQkFDYixLQUFLLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUs7b0JBQ3JDLFdBQVcsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVztvQkFDakQsSUFBSSxFQUFFLElBQUk7aUJBQ1gsQ0FBQztxQkFDRCxPQUFPLEVBQUUsQ0FBQztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLEVBQUUs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LDhDQTJDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB0eXBlIHtcbiAgSXNDb21wbGV0ZVJlcXVlc3QsXG4gIElzQ29tcGxldGVSZXNwb25zZSxcbiAgT25FdmVudFJlc3BvbnNlLFxufSBmcm9tIFwiQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzXCI7XG5cbi8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBPcmdhbml6YXRpb25zIH0gZnJvbSBcImF3cy1zZGtcIjsgXG5cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIGNhcGFibGUgb2YgY3JlYXRpbmcgYW4gYWNjb3VudCBpbnRvIGFuIEFXUyBPcmdhbmlzYXRpb25cbiAqIEBwYXJhbSBldmVudCBBbiBldmVudCB3aXRoIHRoZSBmb2xsb3dpbmcgUmVzb3VyY2VQcm9wZXJ0aWVzOiBFbWFpbCAoY29yZXNwb25kaW5nIHRvIHRoZSBhY2NvdW50IGVtYWlsKSBhbmQgQWNjb3VudE5hbWUgKGNvcnJlc3BvbmRpbmcgdG8gdGhlIGFjY291bnQgbmFtZSlcbiAqIEByZXR1cm5zIFJldHVybnMgYSBQaHlzaWNhbFJlc291cmNlSWQgY29ycmVzcG9uZGluZyB0byB0aGUgQ3JlYXRlQWNjb3VudCByZXF1ZXN0J3MgaWQgbmVjZXNzYXJ5IHRvIGNoZWNrIHRoZSBzdGF0dXMgb2YgdGhlIGNyZWF0aW9uXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9uRXZlbnRIYW5kbGVyKFxuICBldmVudDogYW55XG4pOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZyhcIkV2ZW50OiAlalwiLCBldmVudCk7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgXCJDcmVhdGVcIjpcbiAgICAgIGNvbnN0IGF3c09yZ2FuaXphdGlvbnNDbGllbnQgPSBuZXcgT3JnYW5pemF0aW9ucyh7cmVnaW9uOiAndXMtZWFzdC0xJ30pO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdGFnczogeyBLZXk6IHN0cmluZzsgVmFsdWU6IGFueTsgfVtdID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKGV2ZW50LlJlc291cmNlUHJvcGVydGllcykuZm9yRWFjaCggcHJvcGVydHlLZXkgPT4ge1xuICAgICAgICAgIGlmKCBwcm9wZXJ0eUtleSAhPSAnU2VydmljZVRva2VuJyApIHRhZ3MucHVzaCh7S2V5OiBwcm9wZXJ0eUtleSwgVmFsdWU6IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1twcm9wZXJ0eUtleV19KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhd3NPcmdhbml6YXRpb25zQ2xpZW50XG4gICAgICAgIC5jcmVhdGVBY2NvdW50KHtcbiAgICAgICAgICBFbWFpbDogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkVtYWlsLFxuICAgICAgICAgIEFjY291bnROYW1lOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQWNjb3VudE5hbWUsXG4gICAgICAgICAgVGFnczogdGFnc1xuICAgICAgICB9KVxuICAgICAgICAucHJvbWlzZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImNyZWF0ZSBhY2NvdW50OiAlalwiLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIHsgUGh5c2ljYWxSZXNvdXJjZUlkOiBkYXRhLkNyZWF0ZUFjY291bnRTdGF0dXM/LklkIH07XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjcmVhdGUgYWNjb3VudDogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICBjYXNlIFwiVXBkYXRlXCI6XG4gICAgICByZXR1cm4geyBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCwgUmVzb3VyY2VQcm9wZXJ0aWVzOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2V2ZW50LlJlcXVlc3RUeXBlfSBpcyBub3QgYSBzdXBwb3J0ZWQgb3BlcmF0aW9uYCk7XG4gIH1cblxufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gY2FwYWJsZSB0byBjaGVjayBpZiBhbiBhY2NvdW50IGNyZWF0aW9uIHJlcXVlc3QgaGFzIGJlZW4gY29tcGxldGVkXG4gKiBAcGFyYW0gZXZlbnQgQW4gZXZlbnQgY29udGFpbmluZyBhIFBoeXNpY2FsUmVzb3VyY2VJZCBjb3JyZXNwb25kaW5nIHRvIGEgQ3JlYXRlQWNjb3VudFJlcXVlc3RJZFxuICogQHJldHVybnMgQSBwYXlsb2FkIGNvbnRhaW5pbmcgdGhlIElzQ29tcGxldGUgRmxhZyByZXF1ZXN0ZWQgYnkgY2RrIEN1c3RvbSBSZXNvdXJjZSBmd2sgdG8gZmlndXJlIG91dCBpZiB0aGUgcmVzb3VyY2UgaGFzIGJlZW4gY3JlYXRlZCBvciBmYWlsZWQgdG8gYmUgb3IgaWYgaXQgbmVlZHMgdG8gcmV0cnlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzQ29tcGxldGVIYW5kbGVyKFxuICBldmVudDogSXNDb21wbGV0ZVJlcXVlc3Rcbik6IFByb21pc2U8SXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKFwiRXZlbnQ6ICVqXCIsIGV2ZW50KTtcblxuICBpZighZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBQaHlzaWNhbFJlc291cmNlSWQgcGFyYW1ldGVyLlwiKTtcbiAgfVxuXG4gIGNvbnN0IGF3c09yZ2FuaXphdGlvbnNDbGllbnQgPSBuZXcgT3JnYW5pemF0aW9ucyh7cmVnaW9uOiAndXMtZWFzdC0xJ30pO1xuXG4gIGNvbnN0IGRlc2NyaWJlQ3JlYXRlQWNjb3VudFN0YXR1c1BhcmFtcyA6IE9yZ2FuaXphdGlvbnMuRGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzUmVxdWVzdCA9IHtDcmVhdGVBY2NvdW50UmVxdWVzdElkOiBldmVudC5QaHlzaWNhbFJlc291cmNlSWR9XG4gIGNvbnN0IGRhdGE6IE9yZ2FuaXphdGlvbnMuRGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzUmVzcG9uc2UgID0gYXdhaXQgYXdzT3JnYW5pemF0aW9uc0NsaWVudFxuICAgIC5kZXNjcmliZUNyZWF0ZUFjY291bnRTdGF0dXMoZGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzUGFyYW1zKS5wcm9taXNlKCk7XG5cbiAgY29uc29sZS5sb2coXCJEZXNjcmliZSBhY2NvdW50OiAlalwiLCBkYXRhKTtcblxuICBjb25zdCBDcmVhdGVBY2NvdW50U3RhdHVzID0gZGF0YS5DcmVhdGVBY2NvdW50U3RhdHVzPy5TdGF0ZTtcbiAgY29uc3QgQWNjb3VudElkID0gZGF0YS5DcmVhdGVBY2NvdW50U3RhdHVzPy5BY2NvdW50SWQ7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgXCJDcmVhdGVcIjpcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IENyZWF0ZUFjY291bnRTdGF0dXMgPT09IFwiU1VDQ0VFREVEXCIsIERhdGE6IHtBY2NvdW50SWQ6IEFjY291bnRJZH0gfTtcbiAgICBjYXNlIFwiVXBkYXRlXCI6XG4gICAgICBpZihBY2NvdW50SWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEFkZCB0YWdzOiB0eXBlID0gJHtldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQWNjb3VudFR5cGV9YCk7XG4gICAgICAgIGNvbnN0IHRhZ3M6IHsgS2V5OiBzdHJpbmc7IFZhbHVlOiBhbnk7IH1bXSA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpLmZvckVhY2goIHByb3BlcnR5S2V5ID0+IHtcbiAgICAgICAgICBpZiggcHJvcGVydHlLZXkgIT0gJ1NlcnZpY2VUb2tlbicgKSB0YWdzLnB1c2goe0tleTogcHJvcGVydHlLZXksIFZhbHVlOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbcHJvcGVydHlLZXldfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0YWdzVXBkYXRlUmVxdWVzdERhdGEgPSBhd2FpdCBhd3NPcmdhbml6YXRpb25zQ2xpZW50XG4gICAgICAgIC50YWdSZXNvdXJjZSh7XG4gICAgICAgICAgUmVzb3VyY2VJZDogQWNjb3VudElkISxcbiAgICAgICAgICBUYWdzOiB0YWdzXG4gICAgICAgIH0pXG4gICAgICAgIC5wcm9taXNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRlZCBhY2NvdW50IHRhZ3M6ICVqXCIsIHRhZ3NVcGRhdGVSZXF1ZXN0RGF0YSk7XG4gICAgICB9XG4gICAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IENyZWF0ZUFjY291bnRTdGF0dXMgPT09IFwiU1VDQ0VFREVEXCIsIERhdGE6IHtBY2NvdW50SWQ6IEFjY291bnRJZH0gfTtcbiAgICBjYXNlIFwiRGVsZXRlXCI6XG4gICAgICAvLyBUT0RPOiBmaWd1cmUgb3V0IHdoYXQgdG8gZG8gaGVyZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVsZXRlQWNjb3VudCBpcyBub3QgYSBzdXBwb3J0ZWQgb3BlcmF0aW9uXCIpO1xuICB9XG59XG4iXX0=