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
exports.OrganizationalUnit = void 0;
const core = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
class OrganizationalUnit extends core.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        let ou = new cr.AwsCustomResource(this, "OUCustomResource", {
            onCreate: {
                service: 'Organizations',
                action: 'createOrganizationalUnit',
                physicalResourceId: cr.PhysicalResourceId.fromResponse('OrganizationalUnit.Id'),
                region: 'us-east-1',
                parameters: {
                    Name: props.Name,
                    ParentId: props.ParentId
                }
            },
            installLatestAwsSdk: false,
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
            })
        });
        this.id = ou.getResponseField("OrganizationalUnit.Id");
    }
}
exports.OrganizationalUnit = OrganizationalUnit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uYWwtdW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9yZ2FuaXphdGlvbmFsLXVuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztFQWNFOzs7QUFFRixzQ0FBc0M7QUFDdEMsZ0RBQWdEO0FBT2hELE1BQWEsa0JBQW1CLFNBQVEsSUFBSSxDQUFDLFNBQVM7SUFJbEQsWUFBWSxLQUFxQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUNwQyxrQkFBa0IsRUFDbEI7WUFDRSxRQUFRLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLE1BQU0sRUFBRSwwQkFBMEI7Z0JBQ2xDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUM7Z0JBQy9FLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixVQUFVLEVBQ1I7b0JBQ0UsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO29CQUNoQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7aUJBQ3pCO2FBQ0o7WUFDRCxtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLE1BQU0sRUFBRSxFQUFFLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUM3QztnQkFDRSxTQUFTLEVBQUUsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFlBQVk7YUFDbkQsQ0FDRjtTQUNGLENBQ0YsQ0FBQztRQUVKLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNKO0FBakNELGdEQWlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLlxuWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBPcmdhbml6YXRpb25hbFVuaXRQcm9wcyB7XG4gICAgTmFtZTogc3RyaW5nLFxuICAgIFBhcmVudElkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIE9yZ2FuaXphdGlvbmFsVW5pdCBleHRlbmRzIGNvcmUuQ29uc3RydWN0IHtcblxuICAgIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29yZS5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBPcmdhbml6YXRpb25hbFVuaXRQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIFxuICAgICAgICAgIGxldCBvdSA9IG5ldyBjci5Bd3NDdXN0b21SZXNvdXJjZSh0aGlzLCBcbiAgICAgICAgICAgIFwiT1VDdXN0b21SZXNvdXJjZVwiLCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlOiAnT3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnY3JlYXRlT3JnYW5pemF0aW9uYWxVbml0JyxcbiAgICAgICAgICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGNyLlBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoJ09yZ2FuaXphdGlvbmFsVW5pdC5JZCcpLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsIC8vQVdTIE9yZ2FuaXphdGlvbnMgQVBJIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiB1cy1lYXN0LTEgZm9yIHJvb3QgYWN0aW9uc1xuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6XG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIE5hbWU6IHByb3BzLk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIFBhcmVudElkOiBwcm9wcy5QYXJlbnRJZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBpbnN0YWxsTGF0ZXN0QXdzU2RrOiBmYWxzZSxcbiAgICAgICAgICAgICAgcG9saWN5OiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBjci5Bd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuaWQgPSBvdS5nZXRSZXNwb25zZUZpZWxkKFwiT3JnYW5pemF0aW9uYWxVbml0LklkXCIpO1xuICAgIH1cbn0iXX0=