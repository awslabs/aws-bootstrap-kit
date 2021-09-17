import * as core from "@aws-cdk/core";
export interface CrossAccountZoneDelegationRecordProps {
    targetAccount?: string;
    targetRoleToAssume?: string;
    targetHostedZoneId?: string;
    recordName: string;
    toDelegateNameServers: string[];
    currentAccountId: string;
}
/**
 * Create a NS zone delegation record in the target account
 */
export declare class CrossAccountZoneDelegationRecord extends core.Construct {
    constructor(scope: core.Construct, id: string, props: CrossAccountZoneDelegationRecordProps);
}
