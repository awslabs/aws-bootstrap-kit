import type { IsCompleteRequest, IsCompleteResponse, OnEventResponse } from "@aws-cdk/custom-resources/lib/provider-framework/types";
/**
 * A function that send a verification email
 * @param event An event with the following ResourceProperties: email (coresponding to the root email)
 * @returns Returns a PhysicalResourceId
 */
export declare function onEventHandler(event: any): Promise<OnEventResponse | void>;
/**
 * A function that checks email has been verified
 * @param event An event with the following ResourceProperties: email (coresponding to the root email)
 * @returns A payload containing the IsComplete Flag requested by cdk Custom Resource to figure out if the email has been verified and if not retries later
 */
export declare function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse | void>;
