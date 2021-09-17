"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const custom_resources_1 = require("@aws-cdk/custom-resources");
/**
 * A Custom Resource provider capable of validating emails
 */
class ValidateEmailProvider extends core_1.NestedStack {
    /**
     * Constructor
     *
     * @param scope The parent Construct instantiating this construct
     * @param id This instance name
     */
    constructor(scope, id, props) {
        super(scope, id);
        const code = lambda.Code.fromAsset(path.join(__dirname, "validate-email-handler"));
        const onEventHandler = new lambda.Function(this, "OnEventHandler", {
            code,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: "index.onEventHandler",
            timeout: core_1.Duration.minutes(5)
        });
        onEventHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ["ses:verifyEmailIdentity"],
            resources: ["*"]
        }));
        const isCompleteHandler = new lambda.Function(this, "IsCompleteHandler", {
            code,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: "index.isCompleteHandler",
            timeout: props.timeout ? props.timeout : core_1.Duration.minutes(10)
        });
        isCompleteHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ["ses:getIdentityVerificationAttributes"],
            resources: ["*"]
        }));
        this.provider = new custom_resources_1.Provider(this, "EmailValidationProvider", {
            onEventHandler: onEventHandler,
            isCompleteHandler: isCompleteHandler,
            queryInterval: core_1.Duration.seconds(10)
        });
    }
    /**
     * Creates a stack-singleton resource provider nested stack.
     */
    static getOrCreate(scope, props) {
        const stack = core_1.Stack.of(scope);
        const uid = "@aws-cdk/aws-bootstrap-kit.ValidateEmailProvider";
        return (stack.node.tryFindChild(uid) ||
            new ValidateEmailProvider(stack, uid, props));
    }
}
exports.default = ValidateEmailProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZW1haWwtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWxpZGF0ZS1lbWFpbC1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFO0FBQ0YsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQW9GO0FBQ3BGLGdFQUFxRDtBQU1yRDs7R0FFRztBQUNILE1BQXFCLHFCQUFzQixTQUFRLGtCQUFXO0lBa0I1RDs7Ozs7T0FLRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBaUM7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLENBQUMsQ0FDL0MsQ0FBQztRQUVGLE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDakUsSUFBSTtZQUNKLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsY0FBYyxDQUFDLGVBQWUsQ0FDNUIsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO1lBQ3BDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQ0gsQ0FBQztRQUVGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN2RSxJQUFJO1lBQ0osT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUseUJBQXlCO1lBQ2xDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUM5RCxDQUFDLENBQUM7UUFFSCxpQkFBaUIsQ0FBQyxlQUFlLENBQy9CLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQyx1Q0FBdUMsQ0FBQztZQUNsRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksMkJBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDNUQsY0FBYyxFQUFFLGNBQWM7WUFDOUIsaUJBQWlCLEVBQUUsaUJBQWlCO1lBQ3BDLGFBQWEsRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBMUREOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixFQUFFLEtBQWlDO1FBQzNFLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsa0RBQWtELENBQUM7UUFDL0QsT0FBTyxDQUNKLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBMkI7WUFDdkQsSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUM3QyxDQUFDO0lBQ0osQ0FBQztDQWlERjtBQWpFRCx3Q0FpRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuQ29weXJpZ2h0IEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIFxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gXCJAYXdzLWNkay9hd3MtaWFtXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IENvbnN0cnVjdCwgRHVyYXRpb24sIFN0YWNrLCBOZXN0ZWRTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzXCI7XG5cblxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0ZUVtYWlsUHJvdmlkZXJQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICB0aW1lb3V0PzogRHVyYXRpb247XG59XG4vKipcbiAqIEEgQ3VzdG9tIFJlc291cmNlIHByb3ZpZGVyIGNhcGFibGUgb2YgdmFsaWRhdGluZyBlbWFpbHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFsaWRhdGVFbWFpbFByb3ZpZGVyIGV4dGVuZHMgTmVzdGVkU3RhY2sge1xuICAvKipcbiAgICogVGhlIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlci5cbiAgICovXG4gIHJlYWRvbmx5IHByb3ZpZGVyOiBQcm92aWRlcjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHN0YWNrLXNpbmdsZXRvbiByZXNvdXJjZSBwcm92aWRlciBuZXN0ZWQgc3RhY2suXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QsIHByb3BzOiBWYWxpZGF0ZUVtYWlsUHJvdmlkZXJQcm9wcykge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IHVpZCA9IFwiQGF3cy1jZGsvYXdzLWJvb3RzdHJhcC1raXQuVmFsaWRhdGVFbWFpbFByb3ZpZGVyXCI7XG4gICAgcmV0dXJuIChcbiAgICAgIChzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCh1aWQpIGFzIFZhbGlkYXRlRW1haWxQcm92aWRlcikgfHxcbiAgICAgIG5ldyBWYWxpZGF0ZUVtYWlsUHJvdmlkZXIoc3RhY2ssIHVpZCwgcHJvcHMpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBDb25zdHJ1Y3QgaW5zdGFudGlhdGluZyB0aGlzIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgVGhpcyBpbnN0YW5jZSBuYW1lXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVmFsaWRhdGVFbWFpbFByb3ZpZGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgY29kZSA9IGxhbWJkYS5Db2RlLmZyb21Bc3NldChcbiAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwidmFsaWRhdGUtZW1haWwtaGFuZGxlclwiKVxuICAgICk7XG5cbiAgICBjb25zdCBvbkV2ZW50SGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJPbkV2ZW50SGFuZGxlclwiLCB7XG4gICAgICBjb2RlLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBoYW5kbGVyOiBcImluZGV4Lm9uRXZlbnRIYW5kbGVyXCIsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAgfSk7XG5cbiAgICBvbkV2ZW50SGFuZGxlci5hZGRUb1JvbGVQb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcInNlczp2ZXJpZnlFbWFpbElkZW50aXR5XCJdLFxuICAgICAgICByZXNvdXJjZXM6IFtcIipcIl1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IGlzQ29tcGxldGVIYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIklzQ29tcGxldGVIYW5kbGVyXCIsIHtcbiAgICAgIGNvZGUsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgIGhhbmRsZXI6IFwiaW5kZXguaXNDb21wbGV0ZUhhbmRsZXJcIixcbiAgICAgIHRpbWVvdXQ6IHByb3BzLnRpbWVvdXQgPyBwcm9wcy50aW1lb3V0IDogRHVyYXRpb24ubWludXRlcygxMClcbiAgICB9KTtcblxuICAgIGlzQ29tcGxldGVIYW5kbGVyLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1wic2VzOmdldElkZW50aXR5VmVyaWZpY2F0aW9uQXR0cmlidXRlc1wiXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdXG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKHRoaXMsIFwiRW1haWxWYWxpZGF0aW9uUHJvdmlkZXJcIiwge1xuICAgICAgb25FdmVudEhhbmRsZXI6IG9uRXZlbnRIYW5kbGVyLFxuICAgICAgaXNDb21wbGV0ZUhhbmRsZXI6IGlzQ29tcGxldGVIYW5kbGVyLFxuICAgICAgcXVlcnlJbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcygxMClcbiAgICB9KTtcbiAgfVxufVxuIl19