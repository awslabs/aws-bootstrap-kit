import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";
import { Account } from './account';
/**
 * Properties for RootDns.
 */
export interface RootDnsProps {
    /**
     * The stages Accounts taht will need their subzone delegation.
     */
    readonly stagesAccounts: Account[];
    /**
     * The top level domain name.
     */
    readonly rootHostedZoneDNSName: string;
    /**
     * A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported).
     */
    readonly thirdPartyProviderDNSUsed?: boolean;
}
/**
 * A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation.
 */
export declare class RootDns extends cdk.Construct {
    rootHostedZone: route53.IHostedZone;
    constructor(scope: cdk.Construct, id: string, props: RootDnsProps);
    createStageSubZone(account: Account, rootHostedZoneDNSName: string): route53.HostedZone;
    createDNSAutoUpdateRole(account: Account, stageSubZone: route53.HostedZone): iam.Role;
    createRootHostedZone(props: RootDnsProps): route53.HostedZone;
}
