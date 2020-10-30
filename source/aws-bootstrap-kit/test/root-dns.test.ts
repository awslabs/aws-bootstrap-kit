import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as RootDns from '../lib/dns';

/*
 * Example test 
 */
test('If third party owned dns, Root DNS Zone Created with cfnoutputs for NS records', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");

  const rootDnsProps: RootDns.RootDnsProps = {
    rootHostedZoneDNSName: "ilovemylocalfarmer.dev",
    thirdPartyProviderDNSUsed: true
  }

  // WHEN
  new RootDns.RootDns(stack, 'MyTestConstruct', rootDnsProps);
  // THEN
  expectCDK(stack).to(countResources("AWS::Route53::HostedZone",1));
});
