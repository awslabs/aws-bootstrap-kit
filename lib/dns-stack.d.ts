import * as cdk from '@aws-cdk/core';
import { RootDns, RootDnsProps } from './dns';
/**
 * Properties of the Root DNS Stack
 */
export interface RootDNSStackProps extends cdk.StackProps {
    /**
     * Properties of the Root DNS Construct
     */
    readonly rootDnsProps: RootDnsProps;
}
/**
 * A Stack creating a root DNS Zone with subzone delegation capabilities
 */
export declare class RootDNSStack extends cdk.Stack {
    rootDns: RootDns;
    constructor(scope: cdk.Construct, id: string, props: RootDNSStackProps);
}
