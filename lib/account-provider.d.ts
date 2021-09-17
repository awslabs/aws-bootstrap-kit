import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, NestedStack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
/**
 * A Custom Resource provider capable of creating AWS Accounts
 */
export declare class AccountProvider extends NestedStack {
    /**
     * Creates a stack-singleton resource provider nested stack.
     */
    static getOrCreate(scope: Construct): AccountProvider;
    /**
     * The custom resource provider.
     */
    readonly provider: cr.Provider;
    /**
     * The onEvent handler
     */
    readonly onEventHandler: lambda.Function;
    /**
     * The isComplete handler
     */
    readonly isCompleteHandler: lambda.Function;
    private constructor();
}
