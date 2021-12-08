
import {Construct} from 'constructs';
import * as core from 'aws-cdk-lib/core';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {CrossAccountZoneDelegationRecord} from "./cross-account-zone-delegation-record";

/**
 * Properties to create delegated subzone of a zone hosted in a different account
 *
 */
export interface ICrossAccountDNSDelegatorProps {
    /**
     * The Account hosting the parent zone
     * Optional since can be resolved if the system has been setup with aws-bootstrap-kit
     */
    targetAccount?: string;
    /**
     * The role to Assume in the parent zone's account which has permissions to update the parent zone
     * Optional since can be resolved if the system has been setup with aws-bootstrap-kit
     */
    targetRoleToAssume?: string;
    /**
     * The parent zone Id to add the sub zone delegation NS record to
     * Optional since can be resolved if the system has been setup with aws-bootstrap-kit
     */
    targetHostedZoneId?: string;
    /**
     * The sub zone name to be created
     */
    zoneName: string;
}

/**
 * TODO: propose this to fix https://github.com/aws/aws-cdk/issues/8776
 * High-level construct that creates:
 * 1. A public hosted zone in the current account
 * 2. A record name in the hosted zone id of target account
 *
 * Usage:
 * Create a role with the following permission:
 * {
 *      "Sid": "VisualEditor0",
 *      "Effect": "Allow",
 *      "Action": [
 *          "route53:GetHostedZone",
 *          "route53:ChangeResourceRecordSets"
 *      ],
 *      "Resource": "arn:aws:route53:::hostedzone/ZXXXXXXXXX"
 * }
 *
 * Then use the construct like this:
 *
 * const crossAccountDNSDelegatorProps: ICrossAccountDNSDelegatorProps = {
 *      targetAccount: '1234567890',
 *      targetRoleToAssume: 'DelegateRecordUpdateRoleInThatAccount',
 *      targetHostedZoneId: 'ZXXXXXXXXX',
 *      zoneName: 'subdomain.mydomain.com',
 * };
 *
 * new CrossAccountDNSDelegator(this, 'CrossAccountDNSDelegatorStack', crossAccountDNSDelegatorProps);
 */
export class CrossAccountDNSDelegator extends Construct {
    readonly hostedZone: route53.HostedZone;
    constructor(scope: Construct, id: string, props: ICrossAccountDNSDelegatorProps) {
        super(scope, id);

        const {
            targetAccount,
            targetRoleToAssume,
            targetHostedZoneId,
            zoneName,
        } = props;

        const hostedZone = new route53.HostedZone(this, 'HostedZone', {
            zoneName: zoneName
        });

        this.hostedZone = hostedZone;

        const delegatedNameServers: string[] = hostedZone.hostedZoneNameServers!;

        const currentAccountId = core.Stack.of(this).account;
        new CrossAccountZoneDelegationRecord(this, 'CrossAccountZoneDelegationRecord', {
            targetAccount: targetAccount,
            targetRoleToAssume: targetRoleToAssume,
            targetHostedZoneId: targetHostedZoneId,
            recordName: zoneName,
            toDelegateNameServers: delegatedNameServers,
            currentAccountId: currentAccountId
        });
    }
}
