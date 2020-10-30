import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";
import * as utils from './utils';


/**
 * Properties for RootDns
 */
export interface RootDnsProps {

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
  dnsAutoUpdateRole: iam.Role;

  constructor(scope: cdk.Construct, id: string, props: RootDnsProps) {
    super(scope, id);
    this.dnsAutoUpdateRole = this.createDNSAutoUpdateRole();
    this.rootHostedZone = this.createRootHostedZone(props);

    if ( props.thirdPartyProviderDNSUsed && this.rootHostedZone.hostedZoneNameServers ) {
      new cdk.CfnOutput(this, `NS records`, {value:  cdk.Fn.join(',', this.rootHostedZone.hostedZoneNameServers)});
    } else {
        throw new Error('Creation of DNS domain is not yet supported');
        // TODO: implement call to https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Domains.html#registerDomain-property  
    }
  }

  createDNSAutoUpdateRole() {
    const authorizedPrincipals = [];
    const listAccounts = utils.listAccounts(this);
    for (const accountIndex in listAccounts) {
      const account = listAccounts[accountIndex];
      // TODO: Evaluate against OU Name instead
      if(account.Name && ['Dev', 'Staging', 'Prod'].includes(account.Name)) {
        authorizedPrincipals.push(new iam.AccountPrincipal(account.Id));
      }
    }

    const dnsAutoUpdateRole = new iam.Role(this, "dns-auto-update", {
      assumedBy: authorizedPrincipals.length != 0 ? new iam.CompositePrincipal(...authorizedPrincipals) : new iam.AccountRootPrincipal(),
    });

    dnsAutoUpdateRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "route53:GetHostedZone",
          "route53:ListHostedZones",
          "route53:ChangeResourceRecordSets",
          "route53:ListHostedZonesByName",
          "route53:TestDNSAnswer",
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
