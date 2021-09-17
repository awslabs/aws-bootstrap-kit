import * as core from "@aws-cdk/core";
/**
 * Properties of an AWS account.
 */
export interface IAccountProps {
    /**
     * The email to use to create the AWS account.
     */
    email: string;
    /**
     * The name of the AWS Account.
     */
    name: string;
    /**
     * The account type.
     */
    type?: AccountType;
    /**
     * The (optional) Stage name to be used in CI/CD pipeline.
     */
    stageName?: string;
    /**
     * The (optional) Stage deployment order.
     */
    stageOrder?: number;
    /**
     * List of your services that will be hosted in this account.
     *
     * Set it to [ALL] if you don't plan to have dedicated account for each service.
     */
    hostedServices?: string[];
    /**
     * The potential Organizational Unit Id the account should be placed in.
     */
    parentOrganizationalUnitId?: string;
    /**
     * The potential Organizational Unit Name the account should be placed in.
     */
    parentOrganizationalUnitName?: string;
    /**
     * The AWS account Id.
     */
    id?: string;
}
export declare enum AccountType {
    CICD = "CICD",
    DNS = "DNS",
    STAGE = "STAGE",
    PLAYGROUND = "PLAYGROUND"
}
/**
 * An AWS Account.
 */
export declare class Account extends core.Construct {
    /**
     * Constructor.
     */
    readonly accountName: string;
    readonly accountId: string;
    readonly accountStageName?: string;
    constructor(scope: core.Construct, id: string, accountProps: IAccountProps);
    registerAsDelegatedAdministrator(accountId: string, servicePrincipal: string): void;
}
