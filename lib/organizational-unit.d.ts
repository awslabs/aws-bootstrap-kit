import * as core from '@aws-cdk/core';
export interface OrganizationalUnitProps {
    Name: string;
    ParentId: string;
}
export declare class OrganizationalUnit extends core.Construct {
    readonly id: string;
    constructor(scope: core.Construct, id: string, props: OrganizationalUnitProps);
}
