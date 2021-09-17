import { Construct, Duration, NestedStack, StackProps } from "@aws-cdk/core";
import { Provider } from "@aws-cdk/custom-resources";
export interface ValidateEmailProviderProps extends StackProps {
    timeout?: Duration;
}
/**
 * A Custom Resource provider capable of validating emails
 */
export default class ValidateEmailProvider extends NestedStack {
    /**
     * The custom resource provider.
     */
    readonly provider: Provider;
    /**
     * Creates a stack-singleton resource provider nested stack.
     */
    static getOrCreate(scope: Construct, props: ValidateEmailProviderProps): ValidateEmailProvider;
    /**
     * Constructor
     *
     * @param scope The parent Construct instantiating this construct
     * @param id This instance name
     */
    constructor(scope: Construct, id: string, props: ValidateEmailProviderProps);
}
