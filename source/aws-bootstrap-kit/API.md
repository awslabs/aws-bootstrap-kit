# API Reference

**Classes**

Name|Description
----|-----------
[Account](#aws-bootstrap-kit-account)|An AWS Account.
[AwsOrganizationsStack](#aws-bootstrap-kit-awsorganizationsstack)|A Stack creating the Software Development Life Cycle (SDLC) Organization.
[CrossAccountDNSDelegator](#aws-bootstrap-kit-crossaccountdnsdelegator)|TODO: propose this to fix https://github.com/aws/aws-cdk/issues/8776 High-level construct that creates: 1. A public hosted zone in the current account 2. A record name in the hosted zone id of target account.
[RootDns](#aws-bootstrap-kit-rootdns)|A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation.
[SecureRootUser](#aws-bootstrap-kit-securerootuser)|*No description*
[ValidateEmail](#aws-bootstrap-kit-validateemail)|Email Validation.


**Structs**

Name|Description
----|-----------
[AccountSpec](#aws-bootstrap-kit-accountspec)|AWS Account input details.
[AwsOrganizationsStackProps](#aws-bootstrap-kit-awsorganizationsstackprops)|Properties for AWS SDLC Organizations Stack.
[OUSpec](#aws-bootstrap-kit-ouspec)|Organizational Unit Input details.
[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)|Properties for RootDns.
[ValidateEmailProps](#aws-bootstrap-kit-validateemailprops)|Properties of ValidateEmail.


**Interfaces**

Name|Description
----|-----------
[IAccountProps](#aws-bootstrap-kit-iaccountprops)|Properties of an AWS account.
[ICrossAccountDNSDelegatorProps](#aws-bootstrap-kit-icrossaccountdnsdelegatorprops)|Properties to create delegated subzone of a zone hosted in a different account.


**Enums**

Name|Description
----|-----------
[AccountType](#aws-bootstrap-kit-accounttype)|*No description*



## class Account  <a id="aws-bootstrap-kit-account"></a>

An AWS Account.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new Account(scope: Construct, id: string, accountProps: IAccountProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **accountProps** (<code>[IAccountProps](#aws-bootstrap-kit-iaccountprops)</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**accountId** | <code>string</code> | <span></span>
**accountName** | <code>string</code> | Constructor.
**accountStageName**? | <code>string</code> | __*Optional*__

### Methods


#### registerAsDelegatedAdministrator(accountId, servicePrincipal) <a id="aws-bootstrap-kit-account-registerasdelegatedadministrator"></a>



```ts
registerAsDelegatedAdministrator(accountId: string, servicePrincipal: string): void
```

* **accountId** (<code>string</code>)  *No description*
* **servicePrincipal** (<code>string</code>)  *No description*






## class AwsOrganizationsStack  <a id="aws-bootstrap-kit-awsorganizationsstack"></a>

A Stack creating the Software Development Life Cycle (SDLC) Organization.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable), [ITaggable](#aws-cdk-lib-itaggable)
__Extends__: [Stack](#aws-cdk-lib-stack)

### Initializer




```ts
new AwsOrganizationsStack(scope: Construct, id: string, props: AwsOrganizationsStackProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[AwsOrganizationsStackProps](#aws-bootstrap-kit-awsorganizationsstackprops)</code>)  *No description*
  * **analyticsReporting** (<code>boolean</code>)  Include runtime versioning information in this Stack. __*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-lib-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-lib-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false
  * **email** (<code>string</code>)  Email address of the Root account. 
  * **nestedOU** (<code>Array<[OUSpec](#aws-bootstrap-kit-ouspec)></code>)  Specification of the sub Organizational Unit. 
  * **forceEmailVerification** (<code>boolean</code>)  Enable Email Verification Process. __*Optional*__
  * **rootHostedZoneDNSName** (<code>string</code>)  The main DNS domain name to manage. __*Optional*__
  * **thirdPartyProviderDNSUsed** (<code>boolean</code>)  A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party. __*Optional*__




## class CrossAccountDNSDelegator  <a id="aws-bootstrap-kit-crossaccountdnsdelegator"></a>

TODO: propose this to fix https://github.com/aws/aws-cdk/issues/8776 High-level construct that creates: 1. A public hosted zone in the current account 2. A record name in the hosted zone id of target account.

Usage:
Create a role with the following permission:
{
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
          "route53:GetHostedZone",
          "route53:ChangeResourceRecordSets"
      ],
      "Resource": "arn:aws:route53:::hostedzone/ZXXXXXXXXX"
}

Then use the construct like this:

const crossAccountDNSDelegatorProps: ICrossAccountDNSDelegatorProps = {
      targetAccount: '1234567890',
      targetRoleToAssume: 'DelegateRecordUpdateRoleInThatAccount',
      targetHostedZoneId: 'ZXXXXXXXXX',
      zoneName: 'subdomain.mydomain.com',
};

new CrossAccountDNSDelegator(this, 'CrossAccountDNSDelegatorStack', crossAccountDNSDelegatorProps);

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new CrossAccountDNSDelegator(scope: Construct, id: string, props: ICrossAccountDNSDelegatorProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ICrossAccountDNSDelegatorProps](#aws-bootstrap-kit-icrossaccountdnsdelegatorprops)</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**hostedZone** | <code>[aws_route53.HostedZone](#aws-cdk-lib-aws-route53-hostedzone)</code> | <span></span>



## class RootDns  <a id="aws-bootstrap-kit-rootdns"></a>

A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new RootDns(scope: Construct, id: string, props: RootDnsProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)</code>)  *No description*
  * **rootHostedZoneDNSName** (<code>string</code>)  The top level domain name. 
  * **stagesAccounts** (<code>Array<[Account](#aws-bootstrap-kit-account)></code>)  The stages Accounts taht will need their subzone delegation. 
  * **thirdPartyProviderDNSUsed** (<code>boolean</code>)  A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported). __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**rootHostedZone** | <code>[aws_route53.IHostedZone](#aws-cdk-lib-aws-route53-ihostedzone)</code> | <span></span>

### Methods


#### createDNSAutoUpdateRole(account, stageSubZone) <a id="aws-bootstrap-kit-rootdns-creatednsautoupdaterole"></a>



```ts
createDNSAutoUpdateRole(account: Account, stageSubZone: HostedZone): Role
```

* **account** (<code>[Account](#aws-bootstrap-kit-account)</code>)  *No description*
* **stageSubZone** (<code>[aws_route53.HostedZone](#aws-cdk-lib-aws-route53-hostedzone)</code>)  *No description*

__Returns__:
* <code>[aws_iam.Role](#aws-cdk-lib-aws-iam-role)</code>

#### createRootHostedZone(props) <a id="aws-bootstrap-kit-rootdns-createroothostedzone"></a>



```ts
createRootHostedZone(props: RootDnsProps): HostedZone
```

* **props** (<code>[RootDnsProps](#aws-bootstrap-kit-rootdnsprops)</code>)  *No description*
  * **rootHostedZoneDNSName** (<code>string</code>)  The top level domain name. 
  * **stagesAccounts** (<code>Array<[Account](#aws-bootstrap-kit-account)></code>)  The stages Accounts taht will need their subzone delegation. 
  * **thirdPartyProviderDNSUsed** (<code>boolean</code>)  A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported). __*Optional*__

__Returns__:
* <code>[aws_route53.HostedZone](#aws-cdk-lib-aws-route53-hostedzone)</code>

#### createStageSubZone(account, rootHostedZoneDNSName) <a id="aws-bootstrap-kit-rootdns-createstagesubzone"></a>



```ts
createStageSubZone(account: Account, rootHostedZoneDNSName: string): HostedZone
```

* **account** (<code>[Account](#aws-bootstrap-kit-account)</code>)  *No description*
* **rootHostedZoneDNSName** (<code>string</code>)  *No description*

__Returns__:
* <code>[aws_route53.HostedZone](#aws-cdk-lib-aws-route53-hostedzone)</code>



## class SecureRootUser  <a id="aws-bootstrap-kit-securerootuser"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new SecureRootUser(scope: Construct, id: string, notificationEmail: string)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **notificationEmail** (<code>string</code>)  *No description*




## class ValidateEmail  <a id="aws-bootstrap-kit-validateemail"></a>

Email Validation.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer


Constructor.

```ts
new ValidateEmail(scope: Construct, id: string, props: ValidateEmailProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  The parent Construct instantiating this construct.
* **id** (<code>string</code>)  This instance name.
* **props** (<code>[ValidateEmailProps](#aws-bootstrap-kit-validateemailprops)</code>)  *No description*
  * **email** (<code>string</code>)  Email address of the Root account. 
  * **timeout** (<code>[Duration](#aws-cdk-lib-duration)</code>)  *No description* __*Optional*__




## struct AccountSpec  <a id="aws-bootstrap-kit-accountspec"></a>


AWS Account input details.



Name | Type | Description 
-----|------|-------------
**name** | <code>string</code> | The name of the AWS account.
**email**? | <code>string</code> | The email associated to the AWS account.<br/>__*Optional*__
**hostedServices**? | <code>Array<string></code> | List of your services that will be hosted in this account.<br/>__*Optional*__
**stageName**? | <code>string</code> | The (optional) Stage name to be used in CI/CD pipeline.<br/>__*Optional*__
**stageOrder**? | <code>number</code> | The (optional) Stage deployment order.<br/>__*Optional*__
**type**? | <code>[AccountType](#aws-bootstrap-kit-accounttype)</code> | The account type.<br/>__*Optional*__



## struct AwsOrganizationsStackProps 🔹 <a id="aws-bootstrap-kit-awsorganizationsstackprops"></a>


Properties for AWS SDLC Organizations Stack.



Name | Type | Description 
-----|------|-------------
**email**🔹 | <code>string</code> | Email address of the Root account.
**nestedOU**🔹 | <code>Array<[OUSpec](#aws-bootstrap-kit-ouspec)></code> | Specification of the sub Organizational Unit.
**analyticsReporting**?🔹 | <code>boolean</code> | Include runtime versioning information in this Stack.<br/>__*Default*__: `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key
**description**?🔹 | <code>string</code> | A description of the stack.<br/>__*Default*__: No description.
**env**?🔹 | <code>[Environment](#aws-cdk-lib-environment)</code> | The AWS environment (account/region) where this stack will be deployed.<br/>__*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
**forceEmailVerification**?🔹 | <code>boolean</code> | Enable Email Verification Process.<br/>__*Optional*__
**rootHostedZoneDNSName**?🔹 | <code>string</code> | The main DNS domain name to manage.<br/>__*Optional*__
**stackName**?🔹 | <code>string</code> | Name to deploy the stack with.<br/>__*Default*__: Derived from construct path.
**synthesizer**?🔹 | <code>[IStackSynthesizer](#aws-cdk-lib-istacksynthesizer)</code> | Synthesis method to use while deploying this stack.<br/>__*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
**tags**?🔹 | <code>Map<string, string></code> | Stack tags that will be applied to all the taggable resources and the stack itself.<br/>__*Default*__: {}
**terminationProtection**?🔹 | <code>boolean</code> | Whether to enable termination protection for this stack.<br/>__*Default*__: false
**thirdPartyProviderDNSUsed**?🔹 | <code>boolean</code> | A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party.<br/>__*Optional*__



## interface IAccountProps  <a id="aws-bootstrap-kit-iaccountprops"></a>


Properties of an AWS account.

### Properties


Name | Type | Description 
-----|------|-------------
**email** | <code>string</code> | The email to use to create the AWS account.
**name** | <code>string</code> | The name of the AWS Account.
**hostedServices**? | <code>Array<string></code> | List of your services that will be hosted in this account.<br/>__*Optional*__
**id**? | <code>string</code> | The AWS account Id.<br/>__*Optional*__
**parentOrganizationalUnitId**? | <code>string</code> | The potential Organizational Unit Id the account should be placed in.<br/>__*Optional*__
**parentOrganizationalUnitName**? | <code>string</code> | The potential Organizational Unit Name the account should be placed in.<br/>__*Optional*__
**stageName**? | <code>string</code> | The (optional) Stage name to be used in CI/CD pipeline.<br/>__*Optional*__
**stageOrder**? | <code>number</code> | The (optional) Stage deployment order.<br/>__*Optional*__
**type**? | <code>[AccountType](#aws-bootstrap-kit-accounttype)</code> | The account type.<br/>__*Optional*__



## interface ICrossAccountDNSDelegatorProps  <a id="aws-bootstrap-kit-icrossaccountdnsdelegatorprops"></a>


Properties to create delegated subzone of a zone hosted in a different account.

### Properties


Name | Type | Description 
-----|------|-------------
**zoneName** | <code>string</code> | The sub zone name to be created.
**targetAccount**? | <code>string</code> | The Account hosting the parent zone Optional since can be resolved if the system has been setup with aws-bootstrap-kit.<br/>__*Optional*__
**targetHostedZoneId**? | <code>string</code> | The parent zone Id to add the sub zone delegation NS record to Optional since can be resolved if the system has been setup with aws-bootstrap-kit.<br/>__*Optional*__
**targetRoleToAssume**? | <code>string</code> | The role to Assume in the parent zone's account which has permissions to update the parent zone Optional since can be resolved if the system has been setup with aws-bootstrap-kit.<br/>__*Optional*__



## struct OUSpec  <a id="aws-bootstrap-kit-ouspec"></a>


Organizational Unit Input details.



Name | Type | Description 
-----|------|-------------
**accounts** | <code>Array<[AccountSpec](#aws-bootstrap-kit-accountspec)></code> | Accounts' specification inside in this Organizational Unit.
**name** | <code>string</code> | Name of the Organizational Unit.
**nestedOU**? | <code>Array<[OUSpec](#aws-bootstrap-kit-ouspec)></code> | Specification of sub Organizational Unit.<br/>__*Optional*__



## struct RootDnsProps  <a id="aws-bootstrap-kit-rootdnsprops"></a>


Properties for RootDns.



Name | Type | Description 
-----|------|-------------
**rootHostedZoneDNSName** | <code>string</code> | The top level domain name.
**stagesAccounts** | <code>Array<[Account](#aws-bootstrap-kit-account)></code> | The stages Accounts taht will need their subzone delegation.
**thirdPartyProviderDNSUsed**? | <code>boolean</code> | A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported).<br/>__*Optional*__



## struct ValidateEmailProps  <a id="aws-bootstrap-kit-validateemailprops"></a>


Properties of ValidateEmail.



Name | Type | Description 
-----|------|-------------
**email** | <code>string</code> | Email address of the Root account.
**timeout**? | <code>[Duration](#aws-cdk-lib-duration)</code> | __*Optional*__



## enum AccountType  <a id="aws-bootstrap-kit-accounttype"></a>



Name | Description
-----|-----
**CICD** |
**DNS** |
**STAGE** |
**PLAYGROUND** |


