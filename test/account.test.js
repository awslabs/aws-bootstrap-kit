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
const account_1 = require("../lib/account");
const core_1 = require("@aws-cdk/core");
test("HappyCase", () => {
    const stack = new core_1.Stack();
    new account_1.Account(stack, "myAccount", {
        email: "fakeEmail",
        name: "fakeAccountName",
        parentOrganizationalUnitId: "fakeOUId",
    });
    assert_1.expect(stack).to(assert_1.haveResource("Custom::AccountCreation", {
        Email: "fakeEmail",
        AccountName: "fakeAccountName",
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWNjb3VudC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7QUFFRiw0Q0FBb0U7QUFDcEUsNENBQXlDO0FBQ3pDLHdDQUFzQztBQUV0QyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1FBQzlCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsMEJBQTBCLEVBQUUsVUFBVTtLQUN2QyxDQUFDLENBQUM7SUFFSCxlQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUNqQixxQkFBWSxDQUFDLHlCQUF5QixFQUFFO1FBQ3RDLEtBQUssRUFBRSxXQUFXO1FBQ2xCLFdBQVcsRUFBRSxpQkFBaUI7S0FDL0IsQ0FBQyxDQUNILENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIGhhdmVSZXNvdXJjZSB9IGZyb20gXCJAYXdzLWNkay9hc3NlcnRcIjtcbmltcG9ydCB7IEFjY291bnQgfSBmcm9tIFwiLi4vbGliL2FjY291bnRcIjtcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcblxudGVzdChcIkhhcHB5Q2FzZVwiLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIG5ldyBBY2NvdW50KHN0YWNrLCBcIm15QWNjb3VudFwiLCB7XG4gICAgZW1haWw6IFwiZmFrZUVtYWlsXCIsXG4gICAgbmFtZTogXCJmYWtlQWNjb3VudE5hbWVcIixcbiAgICBwYXJlbnRPcmdhbml6YXRpb25hbFVuaXRJZDogXCJmYWtlT1VJZFwiLFxuICB9KTtcblxuICBleHBlY3RDREsoc3RhY2spLnRvKFxuICAgIGhhdmVSZXNvdXJjZShcIkN1c3RvbTo6QWNjb3VudENyZWF0aW9uXCIsIHtcbiAgICAgIEVtYWlsOiBcImZha2VFbWFpbFwiLFxuICAgICAgQWNjb3VudE5hbWU6IFwiZmFrZUFjY291bnROYW1lXCIsXG4gICAgfSlcbiAgKTtcbn0pO1xuIl19