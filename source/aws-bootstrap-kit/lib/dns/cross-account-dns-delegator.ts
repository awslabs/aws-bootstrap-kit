import * as core from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import {CrossAccountZoneDelegationRecord} from "./cross-account-zone-delegation-record";

export interface CrossAccountDNSDelegatorProps {
    targetAccount: string;
    targetRoleToAssume: string;
    targetHostedZoneId: string;
    zoneName: string;
}

/**
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
 * const crossAccountDNSDelegatorProps: CrossAccountDNSDelegatorProps = {
 *      targetAccount: '1234567890',
 *      targetRoleToAssume: 'DelegateRecordUpdateRoleInThatAccount',
 *      targetHostedZoneId: 'ZXXXXXXXXX',
 *      zoneName: 'subdomain.mydomain.com',
 * };
 *
 * new CrossAccountDNSDelegator(this, 'CrossAccountDNSDelegatorStack', crossAccountDNSDelegatorProps);
 */
export class CrossAccountDNSDelegator extends core.Construct {
    constructor(scope: core.Construct, id: string, props: CrossAccountDNSDelegatorProps) {
        super(scope, id);

        const {
            targetAccount,
            targetRoleToAssume,
            targetHostedZoneId,
            zoneName,
        } = props;

        const publicHostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
            zoneName: zoneName
        });

        const delegatedNameServers: string[] = publicHostedZone.hostedZoneNameServers!;

        new CrossAccountZoneDelegationRecord(this, 'CrossAccountZoneDelegationRecord', {
            targetAccount: targetAccount,
            targetRoleToAssume: targetRoleToAssume,
            targetHostedZoneId: targetHostedZoneId,
            recordName: zoneName,
            toDelegateNameServers: delegatedNameServers,
        });

    }
}
