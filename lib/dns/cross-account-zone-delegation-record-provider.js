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
exports.CrossAccountZoneDelegationRecordProvider = void 0;
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
/**
 * A Custom Resource provider capable of creating a NS record with zone delegation
 * to the given name servers
 *
 * Note that there is no API to check the status of record creation.
 * Thus, we do not implement the `IsComplete` handler here.
 * The newly created record will be temporarily pending (a few seconds).
 */
class CrossAccountZoneDelegationRecordProvider extends core_1.Construct {
    constructor(scope, id, roleArnToAssume) {
        super(scope, id);
        const code = lambda.Code.fromAsset(path.join(__dirname, 'delegation-record-handler'));
        // Handle CREATE/UPDATE/DELETE cross account
        this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
            code,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.onEventHandler',
            timeout: core_1.Duration.minutes(5),
            description: 'Cross-account zone delegation record OnEventHandler'
        });
        // Allow to assume DNS account's updater role
        // roleArn, if not provided will be resolved in the lambda itself but still need to be allowed to assume it.
        this.onEventHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: [roleArnToAssume ? roleArnToAssume : '*'],
        }));
        //Allow to retrieve dynamically the zoneId and the target accountId
        this.onEventHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['route53:listHostedZonesByName', 'organizations:ListAccounts'],
            resources: ['*'],
        }));
        this.provider = new cr.Provider(this, 'CrossAccountZoneDelegationRecordProvider', {
            onEventHandler: this.onEventHandler,
        });
    }
}
exports.CrossAccountZoneDelegationRecordProvider = CrossAccountZoneDelegationRecordProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtYWNjb3VudC16b25lLWRlbGVnYXRpb24tcmVjb3JkLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3Jvc3MtYWNjb3VudC16b25lLWRlbGVnYXRpb24tcmVjb3JkLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjRTs7O0FBRUYsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQW9EO0FBQ3BELGdEQUFnRDtBQUVoRDs7Ozs7OztHQU9HO0FBQ0gsTUFBYSx3Q0FBeUMsU0FBUSxnQkFBUztJQVduRSxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGVBQXdCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO1FBRXRGLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUQsSUFBSTtZQUNKLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDNUIsV0FBVyxFQUFFLHFEQUFxRDtTQUNyRSxDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsNEdBQTRHO1FBQzVHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUMvQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDcEIsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDM0IsU0FBUyxFQUFFLENBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUN4RCxDQUFDLENBQ0wsQ0FBQztRQUVGLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FDL0IsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3BCLE9BQU8sRUFBRSxDQUFDLCtCQUErQixFQUFFLDRCQUE0QixDQUFDO1lBQ3hFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNuQixDQUFDLENBQ0wsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwwQ0FBMEMsRUFBRTtZQUM5RSxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7U0FDdEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBOUNELDRGQThDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbllvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcyc7XG5cbi8qKlxuICogQSBDdXN0b20gUmVzb3VyY2UgcHJvdmlkZXIgY2FwYWJsZSBvZiBjcmVhdGluZyBhIE5TIHJlY29yZCB3aXRoIHpvbmUgZGVsZWdhdGlvblxuICogdG8gdGhlIGdpdmVuIG5hbWUgc2VydmVyc1xuICpcbiAqIE5vdGUgdGhhdCB0aGVyZSBpcyBubyBBUEkgdG8gY2hlY2sgdGhlIHN0YXR1cyBvZiByZWNvcmQgY3JlYXRpb24uXG4gKiBUaHVzLCB3ZSBkbyBub3QgaW1wbGVtZW50IHRoZSBgSXNDb21wbGV0ZWAgaGFuZGxlciBoZXJlLlxuICogVGhlIG5ld2x5IGNyZWF0ZWQgcmVjb3JkIHdpbGwgYmUgdGVtcG9yYXJpbHkgcGVuZGluZyAoYSBmZXcgc2Vjb25kcykuXG4gKi9cbmV4cG9ydCBjbGFzcyBDcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZFByb3ZpZGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAvKipcbiAgICAgKiBUaGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBwcm92aWRlcjogY3IuUHJvdmlkZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb25FdmVudCBoYW5kbGVyXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG9uRXZlbnRIYW5kbGVyOiBsYW1iZGEuRnVuY3Rpb247XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCByb2xlQXJuVG9Bc3N1bWU/OiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjb25zdCBjb2RlID0gbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdkZWxlZ2F0aW9uLXJlY29yZC1oYW5kbGVyJykpO1xuXG4gICAgICAgIC8vIEhhbmRsZSBDUkVBVEUvVVBEQVRFL0RFTEVURSBjcm9zcyBhY2NvdW50XG4gICAgICAgIHRoaXMub25FdmVudEhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdPbkV2ZW50SGFuZGxlcicsIHtcbiAgICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdpbmRleC5vbkV2ZW50SGFuZGxlcicsXG4gICAgICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDcm9zcy1hY2NvdW50IHpvbmUgZGVsZWdhdGlvbiByZWNvcmQgT25FdmVudEhhbmRsZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFsbG93IHRvIGFzc3VtZSBETlMgYWNjb3VudCdzIHVwZGF0ZXIgcm9sZVxuICAgICAgICAvLyByb2xlQXJuLCBpZiBub3QgcHJvdmlkZWQgd2lsbCBiZSByZXNvbHZlZCBpbiB0aGUgbGFtYmRhIGl0c2VsZiBidXQgc3RpbGwgbmVlZCB0byBiZSBhbGxvd2VkIHRvIGFzc3VtZSBpdC5cbiAgICAgICAgdGhpcy5vbkV2ZW50SGFuZGxlci5hZGRUb1JvbGVQb2xpY3koXG4gICAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICAgICAgYWN0aW9uczogWydzdHM6QXNzdW1lUm9sZSddLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogWyByb2xlQXJuVG9Bc3N1bWUgPyByb2xlQXJuVG9Bc3N1bWUgOiAnKiddLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICAvL0FsbG93IHRvIHJldHJpZXZlIGR5bmFtaWNhbGx5IHRoZSB6b25lSWQgYW5kIHRoZSB0YXJnZXQgYWNjb3VudElkXG4gICAgICAgIHRoaXMub25FdmVudEhhbmRsZXIuYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsncm91dGU1MzpsaXN0SG9zdGVkWm9uZXNCeU5hbWUnLCAnb3JnYW5pemF0aW9uczpMaXN0QWNjb3VudHMnXSxcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHRoaXMsICdDcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZFByb3ZpZGVyJywge1xuICAgICAgICAgICAgb25FdmVudEhhbmRsZXI6IHRoaXMub25FdmVudEhhbmRsZXIsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==