import * as core from '@aws-cdk/core';
/**
 * The properties of an OrganizationTrail
 */
export interface IOrganizationTrailProps {
    /**
     * The Id of the organization which the trail works on
     */
    OrganizationId: string;
}
/**
 * This represents an organization trail. An organization trail logs all events for all AWS accounts in that organization
 * and write them in a dedicated S3 bucket in the master account of the organization. To deploy this construct you should
 * the credential of the master account of your organization. It deploys a S3 bucket, enables cloudtrail.amazonaws.com to
 * access the organization API, creates an organization trail and
 * start logging. To learn about AWS Cloud Trail and organization trail,
 * check https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html
 */
export declare class OrganizationTrail extends core.Construct {
    constructor(scope: core.Construct, id: string, props: IOrganizationTrailProps);
}
