import { Construct, Duration } from "@aws-cdk/core";
/**
 * Properties of ValidateEmail.
 */
export interface ValidateEmailProps {
    /**
     * Email address of the Root account.
     */
    readonly email: string;
    readonly timeout?: Duration;
}
/**
 * Email Validation.
 */
export declare class ValidateEmail extends Construct {
    /**
     * Constructor.
     *
     * @param scope The parent Construct instantiating this construct.
     * @param id This instance name.
     */
    constructor(scope: Construct, id: string, props: ValidateEmailProps);
}
