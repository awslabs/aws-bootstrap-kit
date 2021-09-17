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
const aws_sdk_1 = require("aws-sdk");
aws_sdk_1.config.update({ region: "us-east-1" });
/**
 * A function that send a verification email
 * @param event An event with the following ResourceProperties: email (coresponding to the root email)
 * @returns Returns a PhysicalResourceId
 */
async function onEventHandler(event) {
    console.log("Event: %j", event);
    if (event.RequestType === "Create") {
        const ses = new aws_sdk_1.SES();
        await ses
            .verifyEmailIdentity({ EmailAddress: event.ResourceProperties.email })
            .promise();
        return { PhysicalResourceId: 'validateEmail' };
    }
    if (event.RequestType === "Delete") {
        return { PhysicalResourceId: event.PhysicalResourceId };
    }
}
exports.onEventHandler = onEventHandler;
/**
 * A function that checks email has been verified
 * @param event An event with the following ResourceProperties: email (coresponding to the root email)
 * @returns A payload containing the IsComplete Flag requested by cdk Custom Resource to figure out if the email has been verified and if not retries later
 */
async function isCompleteHandler(event) {
    var _a;
    console.log("Event: %j", event);
    if (!event.PhysicalResourceId) {
        throw new Error("Missing PhysicalResourceId parameter.");
    }
    const email = event.ResourceProperties.email;
    if (event.RequestType === "Create") {
        const ses = new aws_sdk_1.SES();
        const response = await ses
            .getIdentityVerificationAttributes({
            Identities: [email]
        })
            .promise();
        return {
            IsComplete: ((_a = response.VerificationAttributes[email]) === null || _a === void 0 ? void 0 : _a.VerificationStatus) === "Success"
        };
    }
    if (event.RequestType === "Delete") {
        return { IsComplete: true };
    }
}
exports.isCompleteHandler = isCompleteHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0U7OztBQUVGLHFDQUFzQztBQU90QyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBRXZDOzs7O0dBSUc7QUFDSSxLQUFLLFVBQVUsY0FBYyxDQUNsQyxLQUFVO0lBRVYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sR0FBRzthQUNOLG1CQUFtQixDQUFDLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNyRSxPQUFPLEVBQUUsQ0FBQztRQUViLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQztLQUNoRDtJQUVELElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQ3pEO0FBQ0gsQ0FBQztBQWpCRCx3Q0FpQkM7QUFFRDs7OztHQUlHO0FBQ0ksS0FBSyxVQUFVLGlCQUFpQixDQUNyQyxLQUF3Qjs7SUFFeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtRQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDMUQ7SUFFRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDO0lBQzdDLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUc7YUFDdkIsaUNBQWlDLENBQUM7WUFDakMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ3BCLENBQUM7YUFDRCxPQUFPLEVBQUUsQ0FBQztRQUViLE9BQU87WUFDTCxVQUFVLEVBQ1IsT0FBQSxRQUFRLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLDBDQUFFLGtCQUFrQixNQUFLLFNBQVM7U0FDM0UsQ0FBQztLQUNIO0lBQ0QsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO0tBQzdCO0FBQ0gsQ0FBQztBQTFCRCw4Q0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIFxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgeyBTRVMsIGNvbmZpZyB9IGZyb20gXCJhd3Mtc2RrXCI7XG5pbXBvcnQgdHlwZSB7XG4gIElzQ29tcGxldGVSZXF1ZXN0LFxuICBJc0NvbXBsZXRlUmVzcG9uc2UsXG4gIE9uRXZlbnRSZXNwb25zZVxufSBmcm9tIFwiQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzXCI7XG5cbmNvbmZpZy51cGRhdGUoeyByZWdpb246IFwidXMtZWFzdC0xXCIgfSk7XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHNlbmQgYSB2ZXJpZmljYXRpb24gZW1haWxcbiAqIEBwYXJhbSBldmVudCBBbiBldmVudCB3aXRoIHRoZSBmb2xsb3dpbmcgUmVzb3VyY2VQcm9wZXJ0aWVzOiBlbWFpbCAoY29yZXNwb25kaW5nIHRvIHRoZSByb290IGVtYWlsKVxuICogQHJldHVybnMgUmV0dXJucyBhIFBoeXNpY2FsUmVzb3VyY2VJZFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25FdmVudEhhbmRsZXIoXG4gIGV2ZW50OiBhbnlcbik6IFByb21pc2U8T25FdmVudFJlc3BvbnNlIHwgdm9pZD4ge1xuICBjb25zb2xlLmxvZyhcIkV2ZW50OiAlalwiLCBldmVudCk7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSBcIkNyZWF0ZVwiKSB7XG4gICAgY29uc3Qgc2VzID0gbmV3IFNFUygpO1xuICAgIGF3YWl0IHNlc1xuICAgICAgLnZlcmlmeUVtYWlsSWRlbnRpdHkoeyBFbWFpbEFkZHJlc3M6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5lbWFpbCB9KVxuICAgICAgLnByb21pc2UoKTtcblxuICAgIHJldHVybiB7IFBoeXNpY2FsUmVzb3VyY2VJZDogJ3ZhbGlkYXRlRW1haWwnIH07XG4gIH1cblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09IFwiRGVsZXRlXCIpIHtcbiAgICByZXR1cm4geyBQaHlzaWNhbFJlc291cmNlSWQ6IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCB9O1xuICB9XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBlbWFpbCBoYXMgYmVlbiB2ZXJpZmllZFxuICogQHBhcmFtIGV2ZW50IEFuIGV2ZW50IHdpdGggdGhlIGZvbGxvd2luZyBSZXNvdXJjZVByb3BlcnRpZXM6IGVtYWlsIChjb3Jlc3BvbmRpbmcgdG8gdGhlIHJvb3QgZW1haWwpXG4gKiBAcmV0dXJucyBBIHBheWxvYWQgY29udGFpbmluZyB0aGUgSXNDb21wbGV0ZSBGbGFnIHJlcXVlc3RlZCBieSBjZGsgQ3VzdG9tIFJlc291cmNlIHRvIGZpZ3VyZSBvdXQgaWYgdGhlIGVtYWlsIGhhcyBiZWVuIHZlcmlmaWVkIGFuZCBpZiBub3QgcmV0cmllcyBsYXRlclxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDb21wbGV0ZUhhbmRsZXIoXG4gIGV2ZW50OiBJc0NvbXBsZXRlUmVxdWVzdFxuKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2UgfCB2b2lkPiB7XG4gIGNvbnNvbGUubG9nKFwiRXZlbnQ6ICVqXCIsIGV2ZW50KTtcblxuICBpZiAoIWV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgUGh5c2ljYWxSZXNvdXJjZUlkIHBhcmFtZXRlci5cIik7XG4gIH1cblxuICBjb25zdCBlbWFpbCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5lbWFpbDtcbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSBcIkNyZWF0ZVwiKSB7XG4gICAgY29uc3Qgc2VzID0gbmV3IFNFUygpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VzXG4gICAgICAuZ2V0SWRlbnRpdHlWZXJpZmljYXRpb25BdHRyaWJ1dGVzKHtcbiAgICAgICAgSWRlbnRpdGllczogW2VtYWlsXVxuICAgICAgfSlcbiAgICAgIC5wcm9taXNlKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTpcbiAgICAgICAgcmVzcG9uc2UuVmVyaWZpY2F0aW9uQXR0cmlidXRlc1tlbWFpbF0/LlZlcmlmaWNhdGlvblN0YXR1cyA9PT0gXCJTdWNjZXNzXCJcbiAgICB9O1xuICB9XG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gXCJEZWxldGVcIikge1xuICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRydWUgfTtcbiAgfVxufVxuIl19