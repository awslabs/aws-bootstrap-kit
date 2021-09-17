import * as cdk from '@aws-cdk/core';
import { AccountType } from './account';
/**
 * AWS Account input details.
 */
export interface AccountSpec {
    /**
     * The name of the AWS account.
     */
    readonly name: string;
    /**
     * The email associated to the AWS account.
     */
    readonly email?: string;
    /**
     * The account type.
     */
    readonly type?: AccountType;
    /**
     * The (optional) Stage name to be used in CI/CD pipeline.
     */
    readonly stageName?: string;
    /**
     * The (optional) Stage deployment order.
     */
    readonly stageOrder?: number;
    /**
     * List of your services that will be hosted in this account.
     *
     * Set it to [ALL] if you don't plan to have dedicated account for each service.
     */
    readonly hostedServices?: string[];
}
/**
 * Organizational Unit Input details.
 */
export interface OUSpec {
    /**
     * Name of the Organizational Unit.
     */
    readonly name: string;
    /**
     * Accounts' specification inside in this Organizational Unit.
     */
    readonly accounts: AccountSpec[];
    /**
     * Specification of sub Organizational Unit.
     */
    readonly nestedOU?: OUSpec[];
}
/**
 * (experimental) Properties for AWS SDLC Organizations Stack.
 *
 * @experimental
 */
export interface AwsOrganizationsStackProps extends cdk.StackProps {
    /**
     * (experimental) Email address of the Root account.
     *
     * @experimental
     */
    readonly email: string;
    /**
     * (experimental) Specification of the sub Organizational Unit.
     *
     * @experimental
     */
    readonly nestedOU: OUSpec[];
    /**
     * (experimental) The main DNS domain name to manage.
     *
     * @experimental
     */
    readonly rootHostedZoneDNSName?: string;
    /**
     * (experimental) A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party.
     *
     * @experimental
     */
    readonly thirdPartyProviderDNSUsed?: boolean;
    /**
     * (experimental) Enable Email Verification Process.
     *
     * @experimental
     */
    readonly forceEmailVerification?: boolean;
}
/**
 * A Stack creating the Software Development Life Cycle (SDLC) Organization.
 */
export declare class AwsOrganizationsStack extends cdk.Stack {
    private readonly emailPrefix?;
    private readonly domain?;
    private readonly stageAccounts;
    private createOrganizationTree;
    constructor(scope: cdk.Construct, id: string, props: AwsOrganizationsStackProps);
}
