import type { IsCompleteRequest, IsCompleteResponse, OnEventResponse } from "@aws-cdk/custom-resources/lib/provider-framework/types";
/**
 * A function capable of creating an account into an AWS Organisation
 * @param event An event with the following ResourceProperties: Email (coresponding to the account email) and AccountName (corresponding to the account name)
 * @returns Returns a PhysicalResourceId corresponding to the CreateAccount request's id necessary to check the status of the creation
 */
export declare function onEventHandler(event: any): Promise<OnEventResponse>;
/**
 * A function capable to check if an account creation request has been completed
 * @param event An event containing a PhysicalResourceId corresponding to a CreateAccountRequestId
 * @returns A payload containing the IsComplete Flag requested by cdk Custom Resource fwk to figure out if the resource has been created or failed to be or if it needs to retry
 */
export declare function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse>;
