
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RootDns, RootDnsProps } from './dns';

/**
 * Properties of the Root DNS Stack
 */
export interface RootDNSStackProps extends cdk.StackProps {
  /**
   * Properties of the Root DNS Construct
   */
  readonly rootDnsProps: RootDnsProps;
}

/**
 * A Stack creating a root DNS Zone with subzone delegation capabilities
 */
export class RootDNSStack extends cdk.Stack {
  public rootDns: RootDns;

  constructor(scope: Construct, id: string, props: RootDNSStackProps) {
    super(scope, id, props);

    this.rootDns = new RootDns(this, 'RootDNSZone', props.rootDnsProps);
  }
}