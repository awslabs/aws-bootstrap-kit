import type { OnEventResponse } from "@aws-cdk/custom-resources/lib/provider-framework/types";
/**
 * Create/Update/Delete a zone delegation record cross-account, depending on event.RequestType
 * Edge cases:
 * 1. CREATE: If the resource has already existed it will update NS to the given name
 * 2. UPDATE: If the resource is missing (was manually deleted), it will fail.
 * 3. DELETE: If the resource is missing (was manually deleted), it will fail.
 * @param event An event with the following ResourceProperties: targetAccount, targetRoleToAssume, targetHostedZoneId, toDelegateNameServers (string[]), recordName
 * @returns Returns a PhysicalResourceId corresponding to record id
 */
export declare function onEventHandler(event: any): Promise<OnEventResponse>;
