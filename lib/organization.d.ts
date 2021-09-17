import * as core from '@aws-cdk/core';
/**
 * This represents an Organization
 */
export declare class Organization extends core.Construct {
    /**
     * The Id of the Organization
     */
    readonly id: string;
    /**
     * The Id of the root Organizational Unit of the Organization
     */
    readonly rootId: string;
    constructor(scope: core.Construct, id: string);
    private enableAWSServiceAccess;
}
