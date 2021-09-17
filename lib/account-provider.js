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
exports.AccountProvider = void 0;
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
/**
 * A Custom Resource provider capable of creating AWS Accounts
 */
class AccountProvider extends core_1.NestedStack {
    constructor(scope, id) {
        super(scope, id);
        const code = lambda.Code.fromAsset(path.join(__dirname, 'account-handler'));
        // Issues UpdateTable API calls
        this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
            code,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.onEventHandler',
            timeout: core_1.Duration.minutes(5),
        });
        this.onEventHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'organizations:CreateAccount',
                'organizations:TagResource'
            ],
            resources: ['*'],
        }));
        // Checks if account is ready
        this.isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
            code,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.isCompleteHandler',
            timeout: core_1.Duration.seconds(30),
        });
        this.isCompleteHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'organizations:CreateAccount',
                'organizations:DescribeCreateAccountStatus',
                'organizations:TagResource'
            ],
            resources: ['*'],
        }));
        this.provider = new cr.Provider(this, 'AccountProvider', {
            onEventHandler: this.onEventHandler,
            isCompleteHandler: this.isCompleteHandler,
            queryInterval: core_1.Duration.seconds(10),
        });
    }
    /**
     * Creates a stack-singleton resource provider nested stack.
     */
    static getOrCreate(scope) {
        const stack = core_1.Stack.of(scope);
        const uid = '@aws-cdk/aws-bootstrap-kit.AccountProvider';
        return stack.node.tryFindChild(uid) || new AccountProvider(stack, uid);
    }
}
exports.AccountProvider = AccountProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFjY291bnQtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOzs7QUFFRiw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyx3Q0FBd0U7QUFDeEUsZ0RBQWdEO0FBR2hEOztHQUVHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLGtCQUFXO0lBeUI5QyxZQUFvQixLQUFnQixFQUFFLEVBQVU7UUFDOUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFNUUsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNoRSxJQUFJO1lBQ0osT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsc0JBQXNCO1lBQy9CLE9BQU8sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FDL0IsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE9BQU8sRUFBRTtnQkFDUCw2QkFBNkI7Z0JBQzdCLDJCQUEyQjthQUM1QjtZQUNELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQ0gsQ0FBQztRQUVKLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN0RSxJQUFJO1lBQ0osT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUseUJBQXlCO1lBQ2xDLE9BQU8sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUM5QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUNsQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsT0FBTyxFQUFFO2dCQUNMLDZCQUE2QjtnQkFDN0IsMkNBQTJDO2dCQUMzQywyQkFBMkI7YUFDNUI7WUFDSCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUNILENBQUM7UUFFSixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDdkQsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ25DLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDekMsYUFBYSxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7SUF2RUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCO1FBQ3hDLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsNENBQTRDLENBQUM7UUFDekQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQW9CLElBQUksSUFBSSxlQUFlLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVGLENBQUM7Q0FpRUY7QUF6RUQsMENBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkNvcHlyaWdodCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICBcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIikuXG5Zb3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IENvbnN0cnVjdCwgRHVyYXRpb24sIE5lc3RlZFN0YWNrLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcyc7XG5cblxuLyoqXG4gKiBBIEN1c3RvbSBSZXNvdXJjZSBwcm92aWRlciBjYXBhYmxlIG9mIGNyZWF0aW5nIEFXUyBBY2NvdW50c1xuICovXG5leHBvcnQgY2xhc3MgQWNjb3VudFByb3ZpZGVyIGV4dGVuZHMgTmVzdGVkU3RhY2sge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIHN0YWNrLXNpbmdsZXRvbiByZXNvdXJjZSBwcm92aWRlciBuZXN0ZWQgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCB1aWQgPSAnQGF3cy1jZGsvYXdzLWJvb3RzdHJhcC1raXQuQWNjb3VudFByb3ZpZGVyJztcbiAgICByZXR1cm4gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQodWlkKSBhcyBBY2NvdW50UHJvdmlkZXIgfHwgbmV3IEFjY291bnRQcm92aWRlcihzdGFjaywgdWlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByb3ZpZGVyOiBjci5Qcm92aWRlcjtcblxuICAvKipcbiAgICogVGhlIG9uRXZlbnQgaGFuZGxlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG9uRXZlbnRIYW5kbGVyOiBsYW1iZGEuRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIFRoZSBpc0NvbXBsZXRlIGhhbmRsZXJcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBpc0NvbXBsZXRlSGFuZGxlcjogbGFtYmRhLkZ1bmN0aW9uO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjb2RlID0gbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdhY2NvdW50LWhhbmRsZXInKSk7XG5cbiAgICAvLyBJc3N1ZXMgVXBkYXRlVGFibGUgQVBJIGNhbGxzXG4gICAgdGhpcy5vbkV2ZW50SGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ09uRXZlbnRIYW5kbGVyJywge1xuICAgICAgY29kZSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4Lm9uRXZlbnRIYW5kbGVyJyxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgfSk7XG5cbiAgICB0aGlzLm9uRXZlbnRIYW5kbGVyLmFkZFRvUm9sZVBvbGljeShcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICdvcmdhbml6YXRpb25zOkNyZWF0ZUFjY291bnQnLFxuICAgICAgICAgICAgJ29yZ2FuaXphdGlvbnM6VGFnUmVzb3VyY2UnXG4gICAgICAgICAgXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICAvLyBDaGVja3MgaWYgYWNjb3VudCBpcyByZWFkeVxuICAgIHRoaXMuaXNDb21wbGV0ZUhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdJc0NvbXBsZXRlSGFuZGxlcicsIHtcbiAgICAgIGNvZGUsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5pc0NvbXBsZXRlSGFuZGxlcicsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICB9KTtcblxuICAgIHRoaXMuaXNDb21wbGV0ZUhhbmRsZXIuYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICAnb3JnYW5pemF0aW9uczpDcmVhdGVBY2NvdW50JyxcbiAgICAgICAgICAgICAgJ29yZ2FuaXphdGlvbnM6RGVzY3JpYmVDcmVhdGVBY2NvdW50U3RhdHVzJyxcbiAgICAgICAgICAgICAgJ29yZ2FuaXphdGlvbnM6VGFnUmVzb3VyY2UnXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIHRoaXMucHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ0FjY291bnRQcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiB0aGlzLm9uRXZlbnRIYW5kbGVyLFxuICAgICAgaXNDb21wbGV0ZUhhbmRsZXI6IHRoaXMuaXNDb21wbGV0ZUhhbmRsZXIsXG4gICAgICBxdWVyeUludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICB9KTtcbiAgfVxufVxuIl19