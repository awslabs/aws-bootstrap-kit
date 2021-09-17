import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";
import { RecordTarget } from "@aws-cdk/aws-route53";
import {Account} from './account';
import * as utils from './dns/delegation-record-handler/utils';

/**
 * Properties for RootDns
 */
export interface RootDnsProps {
  /**
   * The stages Accounts taht will need their subzone delegation
   */
  readonly stagesAccounts: Account[];
  /**
   * The top level domain name
   */
  readonly rootHostedZoneDNSName: string;

  /**
   * A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported)
   */
  readonly thirdPartyProviderDNSUsed?: boolean;
}

/**
 * A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation
 */
export class RootDns extends cdk.Construct {
  rootHostedZone: route53.IHostedZone;

  constructor(scope: cdk.Construct, id: string, props: RootDnsProps) {
    super(scope, id);
    this.rootHostedZone = this.createRootHostedZone(props);

    for (const accountIndex in props.stagesAccounts) {
      const account = props.stagesAccounts[accountIndex];
      const stageSubZone = this.createStageSubZone(
        account,
        props.rootHostedZoneDNSName
      );
      this.createDNSAutoUpdateRole(account, stageSubZone);
      if (stageSubZone.hostedZoneNameServers) {
        new route53.RecordSet(
          this,
          `${account.accountName}SubZoneDelegationNSRecord`,
          {
            recordType: route53.RecordType.NS,
            target: RecordTarget.fromValues(...stageSubZone.hostedZoneNameServers?stageSubZone.hostedZoneNameServers:''),
            recordName: stageSubZone.zoneName,
            zone: this.rootHostedZone,
          }
        );
      }
    }

    if (
      props.thirdPartyProviderDNSUsed &&
      this.rootHostedZone.hostedZoneNameServers
    ) {
      new cdk.CfnOutput(this, `NS records`, {
        value: cdk.Fn.join(",", this.rootHostedZone.hostedZoneNameServers),
      });
    } else {
      throw new Error("Creation of DNS domain is not yet supported");
      // TODO: implement call to https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Domains.html#registerDomain-property
    }
  }

  createStageSubZone(
    account: Account,
    rootHostedZoneDNSName: string
  ): route53.HostedZone {
    const subDomainPrefix = utils.getSubdomainPrefix(account.accountName, account.accountStageName);
    return new route53.HostedZone(this, `${subDomainPrefix}StageSubZone`, {
      zoneName: `${subDomainPrefix}.${rootHostedZoneDNSName}`,
    });
  }

  createDNSAutoUpdateRole(
    account: Account,
    stageSubZone: route53.HostedZone
  ) {
    const dnsAutoUpdateRole = new iam.Role(this, stageSubZone.zoneName, {
      assumedBy: new iam.AccountPrincipal(account.accountId),
      roleName: utils.getDNSUpdateRoleNameFromSubZoneName(stageSubZone.zoneName)
    });

    dnsAutoUpdateRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [stageSubZone.hostedZoneArn],
        actions: [
          "route53:GetHostedZone",
          "route53:ChangeResourceRecordSets",
          "route53:TestDNSAnswer",
        ],
      })
    );
    dnsAutoUpdateRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          "route53:ListHostedZonesByName"
        ],
      })
    );
    return dnsAutoUpdateRole;
  }

  createRootHostedZone(props: RootDnsProps) {
    return new route53.HostedZone(this, "RootHostedZone", {
      zoneName: props.rootHostedZoneDNSName,
    });
  }
}
