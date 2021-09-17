"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossAccountZoneDelegationRecord = void 0;
const core = require("@aws-cdk/core");
const cross_account_zone_delegation_record_provider_1 = require("./cross-account-zone-delegation-record-provider");
/**
 * Create a NS zone delegation record in the target account
 */
class CrossAccountZoneDelegationRecord extends core.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const { targetAccount, targetRoleToAssume } = props;
        const roleArnToAssume = targetAccount && targetRoleToAssume ?
            `arn:aws:iam::${targetAccount}:role/${targetRoleToAssume}`
            : undefined;
        const stack = core.Stack.of(this);
        const crossAccountZoneDelegationRecordProvider = new cross_account_zone_delegation_record_provider_1.CrossAccountZoneDelegationRecordProvider(stack, 'CrossAccountZoneDelegationRecordProvider', roleArnToAssume);
        new core.CustomResource(this, `CrossAccountZoneDelegationRecord-${props.recordName}`, {
            serviceToken: crossAccountZoneDelegationRecordProvider.provider.serviceToken,
            resourceType: "Custom::CrossAccountZoneDelegationRecord",
            properties: {
                ...props
            },
        });
    }
}
exports.CrossAccountZoneDelegationRecord = CrossAccountZoneDelegationRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtYWNjb3VudC16b25lLWRlbGVnYXRpb24tcmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3Jvc3MtYWNjb3VudC16b25lLWRlbGVnYXRpb24tcmVjb3JkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUFzQztBQUN0QyxtSEFBeUc7QUFXekc7O0dBRUc7QUFDSCxNQUFhLGdDQUFpQyxTQUFRLElBQUksQ0FBQyxTQUFTO0lBRWhFLFlBQVksS0FBc0IsRUFBRSxFQUFVLEVBQUUsS0FBNEM7UUFDeEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ3BELE1BQU0sZUFBZSxHQUFHLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxDQUFDO1lBQzdELGdCQUFnQixhQUFhLFNBQVMsa0JBQWtCLEVBQUU7WUFDMUQsQ0FBQyxDQUFBLFNBQVMsQ0FBQztRQUVYLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sd0NBQXdDLEdBQUcsSUFBSSx3RkFBd0MsQ0FDekYsS0FBSyxFQUNMLDBDQUEwQyxFQUMxQyxlQUFlLENBQ2xCLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxjQUFjLENBQ25CLElBQUksRUFDSixvQ0FBb0MsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUN0RDtZQUNJLFlBQVksRUFBRSx3Q0FBd0MsQ0FBQyxRQUFRLENBQUMsWUFBWTtZQUM1RSxZQUFZLEVBQUUsMENBQTBDO1lBQ3hELFVBQVUsRUFBRTtnQkFDUixHQUFHLEtBQUs7YUFDWDtTQUNKLENBQ0osQ0FBQztJQUVOLENBQUM7Q0FDSjtBQTlCRCw0RUE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQge0Nyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvdmlkZXJ9IGZyb20gXCIuL2Nyb3NzLWFjY291bnQtem9uZS1kZWxlZ2F0aW9uLXJlY29yZC1wcm92aWRlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvcHMge1xuICAgIHRhcmdldEFjY291bnQ/OiBzdHJpbmc7XG4gICAgdGFyZ2V0Um9sZVRvQXNzdW1lPzogc3RyaW5nO1xuICAgIHRhcmdldEhvc3RlZFpvbmVJZD86IHN0cmluZztcbiAgICByZWNvcmROYW1lOiBzdHJpbmc7XG4gICAgdG9EZWxlZ2F0ZU5hbWVTZXJ2ZXJzOiBzdHJpbmdbXTtcbiAgICBjdXJyZW50QWNjb3VudElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgTlMgem9uZSBkZWxlZ2F0aW9uIHJlY29yZCBpbiB0aGUgdGFyZ2V0IGFjY291bnRcbiAqL1xuZXhwb3J0IGNsYXNzIENyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkIGV4dGVuZHMgY29yZS5Db25zdHJ1Y3Qge1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvcmUuIENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjb25zdCB7IHRhcmdldEFjY291bnQsIHRhcmdldFJvbGVUb0Fzc3VtZSB9ID0gcHJvcHM7XG4gICAgICAgIGNvbnN0IHJvbGVBcm5Ub0Fzc3VtZSA9IHRhcmdldEFjY291bnQgJiYgdGFyZ2V0Um9sZVRvQXNzdW1lID8gXG4gICAgICAgIGBhcm46YXdzOmlhbTo6JHt0YXJnZXRBY2NvdW50fTpyb2xlLyR7dGFyZ2V0Um9sZVRvQXNzdW1lfWBcbiAgICAgICAgOnVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBzdGFjayA9IGNvcmUuU3RhY2sub2YodGhpcyk7XG4gICAgICAgIGNvbnN0IGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvdmlkZXIgPSBuZXcgQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25SZWNvcmRQcm92aWRlcihcbiAgICAgICAgICAgIHN0YWNrLFxuICAgICAgICAgICAgJ0Nyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvdmlkZXInLFxuICAgICAgICAgICAgcm9sZUFyblRvQXNzdW1lLFxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBjb3JlLkN1c3RvbVJlc291cmNlKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGBDcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZC0ke3Byb3BzLnJlY29yZE5hbWV9YCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlVG9rZW46IGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkUHJvdmlkZXIucHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgICAgICAgICAgIHJlc291cmNlVHlwZTogXCJDdXN0b206OkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkXCIsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgICAuLi5wcm9wc1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICB9XG59XG4iXX0=