import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
/**
 * A Custom Resource provider capable of creating a NS record with zone delegation
 * to the given name servers
 *
 * Note that there is no API to check the status of record creation.
 * Thus, we do not implement the `IsComplete` handler here.
 * The newly created record will be temporarily pending (a few seconds).
 */
export declare class CrossAccountZoneDelegationRecordProvider extends Construct {
    /**
     * The custom resource provider.
     */
    readonly provider: cr.Provider;
    /**
     * The onEvent handler
     */
    readonly onEventHandler: lambda.Function;
    constructor(scope: Construct, id: string, roleArnToAssume?: string);
}
