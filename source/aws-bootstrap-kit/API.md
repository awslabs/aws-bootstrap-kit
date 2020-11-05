# API Reference

**Classes**

Name|Description
----|-----------
[AwsOrganizationsStack](#aws-bootstrap-kit-awsorganizationsstack)|A Stack creating the Software Development Life Cycle (SDLC) Organization.
[RootDNSStack](#aws-bootstrap-kit-rootdnsstack)|A Stack creating a root DNS Zone with subzone delegation capabilities.
[RootDns](#aws-bootstrap-kit-rootdns)|A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation.


**Structs**

Name|Description
----|-----------
[AccountSpec](#aws-bootstrap-kit-accountspec)|AWS Account input details.
[AwsOrganizationsStackProps](#aws-bootstrap-kit-awsorganizationsstackprops)|Properties for AWS SDLC Organizations Stack.
[OUSpec](#aws-bootstrap-kit-ouspec)|Organizational Unit Input details.
[RootDNSStackProps](#aws-bootstrap-kit-rootdnsstackprops)|Properties of the Root DNS Stack.
[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)|Properties for RootDns.



## class AwsOrganizationsStack  <a id="aws-bootstrap-kit-awsorganizationsstack"></a>

A Stack creating the Software Development Life Cycle (SDLC) Organization.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable)
__Extends__: [Stack](#aws-cdk-core-stack)

### Initializer




```ts
new AwsOrganizationsStack(scope: Construct, id: string, props: AwsOrganizationsStackProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[AwsOrganizationsStackProps](#aws-bootstrap-kit-awsorganizationsstackprops)</code>)  *No description*
  * **analyticsReporting** (<code>boolean</code>)  Include runtime versioning information in this Stack. __*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-core-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false
  * **email** (<code>string</code>)  Email address of the Root account. 
  * **nestedOU** (<code>Array<[OUSpec](#aws-bootstrap-kit-ouspec)></code>)  Specification of the sub Organizational Unit. 




## class RootDNSStack  <a id="aws-bootstrap-kit-rootdnsstack"></a>

A Stack creating a root DNS Zone with subzone delegation capabilities.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable)
__Extends__: [Stack](#aws-cdk-core-stack)

### Initializer




```ts
new RootDNSStack(scope: Construct, id: string, props: RootDNSStackProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[RootDNSStackProps](#aws-bootstrap-kit-rootdnsstackprops)</code>)  *No description*
  * **analyticsReporting** (<code>boolean</code>)  Include runtime versioning information in this Stack. __*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-core-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false
  * **rootDnsProps** (<code>[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)</code>)  Properties of the Root DNS Construct. 



### Properties


Name | Type | Description 
-----|------|-------------
**rootDns** | <code>[RootDns](#aws-bootstrap-kit-rootdns)</code> | <span></span>



## class RootDns  <a id="aws-bootstrap-kit-rootdns"></a>

A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new RootDns(scope: Construct, id: string, props: RootDnsProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)</code>)  *No description*
  * **rootHostedZoneDNSName** (<code>string</code>)  The top level domain name. 
  * **thirdPartyProviderDNSUsed** (<code>boolean</code>)  A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported). __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**dnsAutoUpdateRole** | <code>[Role](#aws-cdk-aws-iam-role)</code> | <span></span>
**rootHostedZone** | <code>[IHostedZone](#aws-cdk-aws-route53-ihostedzone)</code> | <span></span>

### Methods


#### createDNSAutoUpdateRole() <a id="aws-bootstrap-kit-rootdns-creatednsautoupdaterole"></a>



```ts
createDNSAutoUpdateRole(): Role
```


__Returns__:
* <code>[Role](#aws-cdk-aws-iam-role)</code>

#### createRootHostedZone(props) <a id="aws-bootstrap-kit-rootdns-createroothostedzone"></a>



```ts
createRootHostedZone(props: RootDnsProps): HostedZone
```

* **props** (<code>[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)</code>)  *No description*
  * **rootHostedZoneDNSName** (<code>string</code>)  The top level domain name. 
  * **thirdPartyProviderDNSUsed** (<code>boolean</code>)  A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported). __*Optional*__

__Returns__:
* <code>[HostedZone](#aws-cdk-aws-route53-hostedzone)</code>



## struct AccountSpec  <a id="aws-bootstrap-kit-accountspec"></a>


AWS Account input details.



Name | Type | Description 
-----|------|-------------
**name** | <code>string</code> | The name of the AWS account.
**email**? | <code>string</code> | The email associated to the AWS account.<br/>__*Optional*__



## struct AwsOrganizationsStackProps 🔹 <a id="aws-bootstrap-kit-awsorganizationsstackprops"></a>


Properties for AWS SDLC Organizations Stack.



Name | Type | Description 
-----|------|-------------
**email**🔹 | <code>string</code> | Email address of the Root account.
**nestedOU**🔹 | <code>Array<[OUSpec](#aws-bootstrap-kit-ouspec)></code> | Specification of the sub Organizational Unit.
**analyticsReporting**?🔹 | <code>boolean</code> | Include runtime versioning information in this Stack.<br/>__*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
**description**?🔹 | <code>string</code> | A description of the stack.<br/>__*Default*__: No description.
**env**?🔹 | <code>[Environment](#aws-cdk-core-environment)</code> | The AWS environment (account/region) where this stack will be deployed.<br/>__*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
**stackName**?🔹 | <code>string</code> | Name to deploy the stack with.<br/>__*Default*__: Derived from construct path.
**synthesizer**?🔹 | <code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code> | Synthesis method to use while deploying this stack.<br/>__*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
**tags**?🔹 | <code>Map<string, string></code> | Stack tags that will be applied to all the taggable resources and the stack itself.<br/>__*Default*__: {}
**terminationProtection**?🔹 | <code>boolean</code> | Whether to enable termination protection for this stack.<br/>__*Default*__: false



## struct OUSpec  <a id="aws-bootstrap-kit-ouspec"></a>


Organizational Unit Input details.



Name | Type | Description 
-----|------|-------------
**accounts** | <code>Array<[AccountSpec](#aws-bootstrap-kit-accountspec)></code> | Accounts' specification inside in this Organizational Unit.
**name** | <code>string</code> | Name of the Organizational Unit.
**nestedOU**? | <code>Array<[OUSpec](#aws-bootstrap-kit-ouspec)></code> | Specification of sub Organizational Unit.<br/>__*Optional*__



## struct RootDNSStackProps  <a id="aws-bootstrap-kit-rootdnsstackprops"></a>


Properties of the Root DNS Stack.



Name | Type | Description 
-----|------|-------------
**rootDnsProps** | <code>[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)</code> | Properties of the Root DNS Construct.
**analyticsReporting**? | <code>boolean</code> | Include runtime versioning information in this Stack.<br/>__*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
**description**? | <code>string</code> | A description of the stack.<br/>__*Default*__: No description.
**env**? | <code>[Environment](#aws-cdk-core-environment)</code> | The AWS environment (account/region) where this stack will be deployed.<br/>__*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
**stackName**? | <code>string</code> | Name to deploy the stack with.<br/>__*Default*__: Derived from construct path.
**synthesizer**? | <code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code> | Synthesis method to use while deploying this stack.<br/>__*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
**tags**? | <code>Map<string, string></code> | Stack tags that will be applied to all the taggable resources and the stack itself.<br/>__*Default*__: {}
**terminationProtection**? | <code>boolean</code> | Whether to enable termination protection for this stack.<br/>__*Default*__: false



## struct RootDnsProps  <a id="aws-bootstrap-kit-rootdnsprops"></a>


Properties for RootDns.



Name | Type | Description 
-----|------|-------------
**rootHostedZoneDNSName** | <code>string</code> | The top level domain name.
**thirdPartyProviderDNSUsed**? | <code>boolean</code> | A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported).<br/>__*Optional*__



