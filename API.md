# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Account <a name="Account" id="aws-bootstrap-kit.Account"></a>

An AWS Account.

#### Initializers <a name="Initializers" id="aws-bootstrap-kit.Account.Initializer"></a>

```typescript
import { Account } from 'aws-bootstrap-kit'

new Account(scope: Construct, id: string, accountProps: IAccountProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.Account.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.Account.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.Account.Initializer.parameter.accountProps">accountProps</a></code> | <code><a href="#aws-bootstrap-kit.IAccountProps">IAccountProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-bootstrap-kit.Account.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-bootstrap-kit.Account.Initializer.parameter.id"></a>

- *Type:* string

---

##### `accountProps`<sup>Required</sup> <a name="accountProps" id="aws-bootstrap-kit.Account.Initializer.parameter.accountProps"></a>

- *Type:* <a href="#aws-bootstrap-kit.IAccountProps">IAccountProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.Account.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#aws-bootstrap-kit.Account.registerAsDelegatedAdministrator">registerAsDelegatedAdministrator</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="aws-bootstrap-kit.Account.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `registerAsDelegatedAdministrator` <a name="registerAsDelegatedAdministrator" id="aws-bootstrap-kit.Account.registerAsDelegatedAdministrator"></a>

```typescript
public registerAsDelegatedAdministrator(accountId: string, servicePrincipal: string): void
```

###### `accountId`<sup>Required</sup> <a name="accountId" id="aws-bootstrap-kit.Account.registerAsDelegatedAdministrator.parameter.accountId"></a>

- *Type:* string

---

###### `servicePrincipal`<sup>Required</sup> <a name="servicePrincipal" id="aws-bootstrap-kit.Account.registerAsDelegatedAdministrator.parameter.servicePrincipal"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.Account.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-bootstrap-kit.Account.isConstruct"></a>

```typescript
import { Account } from 'aws-bootstrap-kit'

Account.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.Account.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.Account.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#aws-bootstrap-kit.Account.property.accountId">accountId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.Account.property.accountName">accountName</a></code> | <code>string</code> | Constructor. |
| <code><a href="#aws-bootstrap-kit.Account.property.accountStageName">accountStageName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.Account.property.accountStageOrder">accountStageOrder</a></code> | <code>number</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-bootstrap-kit.Account.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `accountId`<sup>Required</sup> <a name="accountId" id="aws-bootstrap-kit.Account.property.accountId"></a>

```typescript
public readonly accountId: string;
```

- *Type:* string

---

##### `accountName`<sup>Required</sup> <a name="accountName" id="aws-bootstrap-kit.Account.property.accountName"></a>

```typescript
public readonly accountName: string;
```

- *Type:* string

Constructor.

---

##### `accountStageName`<sup>Optional</sup> <a name="accountStageName" id="aws-bootstrap-kit.Account.property.accountStageName"></a>

```typescript
public readonly accountStageName: string;
```

- *Type:* string

---

##### `accountStageOrder`<sup>Optional</sup> <a name="accountStageOrder" id="aws-bootstrap-kit.Account.property.accountStageOrder"></a>

```typescript
public readonly accountStageOrder: number;
```

- *Type:* number

---


### AwsOrganizationsStack <a name="AwsOrganizationsStack" id="aws-bootstrap-kit.AwsOrganizationsStack"></a>

A Stack creating the Software Development Life Cycle (SDLC) Organization.

#### Initializers <a name="Initializers" id="aws-bootstrap-kit.AwsOrganizationsStack.Initializer"></a>

```typescript
import { AwsOrganizationsStack } from 'aws-bootstrap-kit'

new AwsOrganizationsStack(scope: Construct, id: string, props: AwsOrganizationsStackProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.Initializer.parameter.props">props</a></code> | <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps">AwsOrganizationsStackProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-bootstrap-kit.AwsOrganizationsStack.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-bootstrap-kit.AwsOrganizationsStack.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="aws-bootstrap-kit.AwsOrganizationsStack.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-bootstrap-kit.AwsOrganizationsStackProps">AwsOrganizationsStackProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.addDependency">addDependency</a></code> | Add a dependency between this stack and another stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.addMetadata">addMetadata</a></code> | Adds an arbitary key-value pair, with information you want to record about the stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.addTransform">addTransform</a></code> | Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.exportStringListValue">exportStringListValue</a></code> | Create a CloudFormation Export for a string list value. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.exportValue">exportValue</a></code> | Create a CloudFormation Export for a string value. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.formatArn">formatArn</a></code> | Creates an ARN from components. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.getLogicalId">getLogicalId</a></code> | Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.regionalFact">regionalFact</a></code> | Look up a fact value for the given fact for the region of this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.renameLogicalId">renameLogicalId</a></code> | Rename a generated logical identities. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.reportMissingContextKey">reportMissingContextKey</a></code> | Indicate that a context key was expected. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.resolve">resolve</a></code> | Resolve a tokenized value in the context of the current stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.splitArn">splitArn</a></code> | Splits the provided ARN into its components. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.toJsonString">toJsonString</a></code> | Convert an object, potentially containing tokens, to a JSON string. |

---

##### `toString` <a name="toString" id="aws-bootstrap-kit.AwsOrganizationsStack.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDependency` <a name="addDependency" id="aws-bootstrap-kit.AwsOrganizationsStack.addDependency"></a>

```typescript
public addDependency(target: Stack, reason?: string): void
```

Add a dependency between this stack and another stack.

This can be used to define dependencies between any two stacks within an
app, and also supports nested stacks.

###### `target`<sup>Required</sup> <a name="target" id="aws-bootstrap-kit.AwsOrganizationsStack.addDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.Stack

---

###### `reason`<sup>Optional</sup> <a name="reason" id="aws-bootstrap-kit.AwsOrganizationsStack.addDependency.parameter.reason"></a>

- *Type:* string

---

##### `addMetadata` <a name="addMetadata" id="aws-bootstrap-kit.AwsOrganizationsStack.addMetadata"></a>

```typescript
public addMetadata(key: string, value: any): void
```

Adds an arbitary key-value pair, with information you want to record about the stack.

These get translated to the Metadata section of the generated template.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html)

###### `key`<sup>Required</sup> <a name="key" id="aws-bootstrap-kit.AwsOrganizationsStack.addMetadata.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="aws-bootstrap-kit.AwsOrganizationsStack.addMetadata.parameter.value"></a>

- *Type:* any

---

##### `addTransform` <a name="addTransform" id="aws-bootstrap-kit.AwsOrganizationsStack.addTransform"></a>

```typescript
public addTransform(transform: string): void
```

Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template.

Duplicate values are removed when stack is synthesized.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html)

*Example*

```typescript
declare const stack: Stack;

stack.addTransform('AWS::Serverless-2016-10-31')
```


###### `transform`<sup>Required</sup> <a name="transform" id="aws-bootstrap-kit.AwsOrganizationsStack.addTransform.parameter.transform"></a>

- *Type:* string

The transform to add.

---

##### `exportStringListValue` <a name="exportStringListValue" id="aws-bootstrap-kit.AwsOrganizationsStack.exportStringListValue"></a>

```typescript
public exportStringListValue(exportedValue: any, options?: ExportValueOptions): string[]
```

Create a CloudFormation Export for a string list value.

Returns a string list representing the corresponding `Fn.importValue()`
expression for this Export. The export expression is automatically wrapped with an
`Fn::Join` and the import value with an `Fn::Split`, since CloudFormation can only
export strings. You can control the name for the export by passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

See `exportValue` for an example of this process.

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="aws-bootstrap-kit.AwsOrganizationsStack.exportStringListValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="aws-bootstrap-kit.AwsOrganizationsStack.exportStringListValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `exportValue` <a name="exportValue" id="aws-bootstrap-kit.AwsOrganizationsStack.exportValue"></a>

```typescript
public exportValue(exportedValue: any, options?: ExportValueOptions): string
```

Create a CloudFormation Export for a string value.

Returns a string representing the corresponding `Fn.importValue()`
expression for this Export. You can control the name for the export by
passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

## Example

Here is how the process works. Let's say there are two stacks,
`producerStack` and `consumerStack`, and `producerStack` has a bucket
called `bucket`, which is referenced by `consumerStack` (perhaps because
an AWS Lambda Function writes into it, or something like that).

It is not safe to remove `producerStack.bucket` because as the bucket is being
deleted, `consumerStack` might still be using it.

Instead, the process takes two deployments:

### Deployment 1: break the relationship

- Make sure `consumerStack` no longer references `bucket.bucketName` (maybe the consumer
   stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
   remove the Lambda Function altogether).
- In the `ProducerStack` class, call `this.exportValue(this.bucket.bucketName)`. This
   will make sure the CloudFormation Export continues to exist while the relationship
   between the two stacks is being broken.
- Deploy (this will effectively only change the `consumerStack`, but it's safe to deploy both).

### Deployment 2: remove the bucket resource

- You are now free to remove the `bucket` resource from `producerStack`.
- Don't forget to remove the `exportValue()` call as well.
- Deploy again (this time only the `producerStack` will be changed -- the bucket will be deleted).

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="aws-bootstrap-kit.AwsOrganizationsStack.exportValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="aws-bootstrap-kit.AwsOrganizationsStack.exportValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `formatArn` <a name="formatArn" id="aws-bootstrap-kit.AwsOrganizationsStack.formatArn"></a>

```typescript
public formatArn(components: ArnComponents): string
```

Creates an ARN from components.

If `partition`, `region` or `account` are not specified, the stack's
partition, region and account will be used.

If any component is the empty string, an empty string will be inserted
into the generated ARN at the location that component corresponds to.

The ARN will be formatted as follows:

   arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}

The required ARN pieces that are omitted will be taken from the stack that
the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
can be 'undefined'.

###### `components`<sup>Required</sup> <a name="components" id="aws-bootstrap-kit.AwsOrganizationsStack.formatArn.parameter.components"></a>

- *Type:* aws-cdk-lib.ArnComponents

---

##### `getLogicalId` <a name="getLogicalId" id="aws-bootstrap-kit.AwsOrganizationsStack.getLogicalId"></a>

```typescript
public getLogicalId(element: CfnElement): string
```

Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource.

This method is called when a `CfnElement` is created and used to render the
initial logical identity of resources. Logical ID renames are applied at
this stage.

This method uses the protected method `allocateLogicalId` to render the
logical ID for an element. To modify the naming scheme, extend the `Stack`
class and override this method.

###### `element`<sup>Required</sup> <a name="element" id="aws-bootstrap-kit.AwsOrganizationsStack.getLogicalId.parameter.element"></a>

- *Type:* aws-cdk-lib.CfnElement

The CloudFormation element for which a logical identity is needed.

---

##### `regionalFact` <a name="regionalFact" id="aws-bootstrap-kit.AwsOrganizationsStack.regionalFact"></a>

```typescript
public regionalFact(factName: string, defaultValue?: string): string
```

Look up a fact value for the given fact for the region of this stack.

Will return a definite value only if the region of the current stack is resolved.
If not, a lookup map will be added to the stack and the lookup will be done at
CDK deployment time.

What regions will be included in the lookup map is controlled by the
`@aws-cdk/core:target-partitions` context value: it must be set to a list
of partitions, and only regions from the given partitions will be included.
If no such context key is set, all regions will be included.

This function is intended to be used by construct library authors. Application
builders can rely on the abstractions offered by construct libraries and do
not have to worry about regional facts.

If `defaultValue` is not given, it is an error if the fact is unknown for
the given region.

###### `factName`<sup>Required</sup> <a name="factName" id="aws-bootstrap-kit.AwsOrganizationsStack.regionalFact.parameter.factName"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="aws-bootstrap-kit.AwsOrganizationsStack.regionalFact.parameter.defaultValue"></a>

- *Type:* string

---

##### `renameLogicalId` <a name="renameLogicalId" id="aws-bootstrap-kit.AwsOrganizationsStack.renameLogicalId"></a>

```typescript
public renameLogicalId(oldId: string, newId: string): void
```

Rename a generated logical identities.

To modify the naming scheme strategy, extend the `Stack` class and
override the `allocateLogicalId` method.

###### `oldId`<sup>Required</sup> <a name="oldId" id="aws-bootstrap-kit.AwsOrganizationsStack.renameLogicalId.parameter.oldId"></a>

- *Type:* string

---

###### `newId`<sup>Required</sup> <a name="newId" id="aws-bootstrap-kit.AwsOrganizationsStack.renameLogicalId.parameter.newId"></a>

- *Type:* string

---

##### `reportMissingContextKey` <a name="reportMissingContextKey" id="aws-bootstrap-kit.AwsOrganizationsStack.reportMissingContextKey"></a>

```typescript
public reportMissingContextKey(report: MissingContext): void
```

Indicate that a context key was expected.

Contains instructions which will be emitted into the cloud assembly on how
the key should be supplied.

###### `report`<sup>Required</sup> <a name="report" id="aws-bootstrap-kit.AwsOrganizationsStack.reportMissingContextKey.parameter.report"></a>

- *Type:* aws-cdk-lib.cloud_assembly_schema.MissingContext

The set of parameters needed to obtain the context.

---

##### `resolve` <a name="resolve" id="aws-bootstrap-kit.AwsOrganizationsStack.resolve"></a>

```typescript
public resolve(obj: any): any
```

Resolve a tokenized value in the context of the current stack.

###### `obj`<sup>Required</sup> <a name="obj" id="aws-bootstrap-kit.AwsOrganizationsStack.resolve.parameter.obj"></a>

- *Type:* any

---

##### `splitArn` <a name="splitArn" id="aws-bootstrap-kit.AwsOrganizationsStack.splitArn"></a>

```typescript
public splitArn(arn: string, arnFormat: ArnFormat): ArnComponents
```

Splits the provided ARN into its components.

Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
and a Token representing a dynamic CloudFormation expression
(in which case the returned components will also be dynamic CloudFormation expressions,
encoded as Tokens).

###### `arn`<sup>Required</sup> <a name="arn" id="aws-bootstrap-kit.AwsOrganizationsStack.splitArn.parameter.arn"></a>

- *Type:* string

the ARN to split into its components.

---

###### `arnFormat`<sup>Required</sup> <a name="arnFormat" id="aws-bootstrap-kit.AwsOrganizationsStack.splitArn.parameter.arnFormat"></a>

- *Type:* aws-cdk-lib.ArnFormat

the expected format of 'arn' - depends on what format the service 'arn' represents uses.

---

##### `toJsonString` <a name="toJsonString" id="aws-bootstrap-kit.AwsOrganizationsStack.toJsonString"></a>

```typescript
public toJsonString(obj: any, space?: number): string
```

Convert an object, potentially containing tokens, to a JSON string.

###### `obj`<sup>Required</sup> <a name="obj" id="aws-bootstrap-kit.AwsOrganizationsStack.toJsonString.parameter.obj"></a>

- *Type:* any

---

###### `space`<sup>Optional</sup> <a name="space" id="aws-bootstrap-kit.AwsOrganizationsStack.toJsonString.parameter.space"></a>

- *Type:* number

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.isStack">isStack</a></code> | Return whether the given object is a Stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.of">of</a></code> | Looks up the first stack scope in which `construct` is defined. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-bootstrap-kit.AwsOrganizationsStack.isConstruct"></a>

```typescript
import { AwsOrganizationsStack } from 'aws-bootstrap-kit'

AwsOrganizationsStack.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.AwsOrganizationsStack.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isStack` <a name="isStack" id="aws-bootstrap-kit.AwsOrganizationsStack.isStack"></a>

```typescript
import { AwsOrganizationsStack } from 'aws-bootstrap-kit'

AwsOrganizationsStack.isStack(x: any)
```

Return whether the given object is a Stack.

We do attribute detection since we can't reliably use 'instanceof'.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.AwsOrganizationsStack.isStack.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="aws-bootstrap-kit.AwsOrganizationsStack.of"></a>

```typescript
import { AwsOrganizationsStack } from 'aws-bootstrap-kit'

AwsOrganizationsStack.of(construct: IConstruct)
```

Looks up the first stack scope in which `construct` is defined.

Fails if there is no stack up the tree.

###### `construct`<sup>Required</sup> <a name="construct" id="aws-bootstrap-kit.AwsOrganizationsStack.of.parameter.construct"></a>

- *Type:* constructs.IConstruct

The construct to start the search from.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.account">account</a></code> | <code>string</code> | The AWS account into which this stack will be deployed. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.artifactId">artifactId</a></code> | <code>string</code> | The ID of the cloud assembly artifact for this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.availabilityZones">availabilityZones</a></code> | <code>string[]</code> | Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.bundlingRequired">bundlingRequired</a></code> | <code>boolean</code> | Indicates whether the stack requires bundling or not. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.dependencies">dependencies</a></code> | <code>aws-cdk-lib.Stack[]</code> | Return the stacks this stack depends on. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.environment">environment</a></code> | <code>string</code> | The environment coordinates in which this stack is deployed. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.nested">nested</a></code> | <code>boolean</code> | Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.notificationArns">notificationArns</a></code> | <code>string[]</code> | Returns the list of notification Amazon Resource Names (ARNs) for the current stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.partition">partition</a></code> | <code>string</code> | The partition in which this stack is defined. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.region">region</a></code> | <code>string</code> | The AWS region into which this stack will be deployed (e.g. `us-west-2`). |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.stackId">stackId</a></code> | <code>string</code> | The ID of the stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.stackName">stackName</a></code> | <code>string</code> | The concrete CloudFormation physical stack name. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method for this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.tags">tags</a></code> | <code>aws-cdk-lib.TagManager</code> | Tags to be applied to the stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.templateFile">templateFile</a></code> | <code>string</code> | The name of the CloudFormation template file emitted to the output directory during synthesis. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.templateOptions">templateOptions</a></code> | <code>aws-cdk-lib.ITemplateOptions</code> | Options for CloudFormation template (like version, transform, description). |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.urlSuffix">urlSuffix</a></code> | <code>string</code> | The Amazon domain suffix for the region in which this stack is defined. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.nestedStackParent">nestedStackParent</a></code> | <code>aws-cdk-lib.Stack</code> | If this is a nested stack, returns it's parent stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.nestedStackResource">nestedStackResource</a></code> | <code>aws-cdk-lib.CfnResource</code> | If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether termination protection is enabled for this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStack.property.rootDns">rootDns</a></code> | <code><a href="#aws-bootstrap-kit.RootDns">RootDns</a></code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-bootstrap-kit.AwsOrganizationsStack.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `account`<sup>Required</sup> <a name="account" id="aws-bootstrap-kit.AwsOrganizationsStack.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string

The AWS account into which this stack will be deployed.

This value is resolved according to the following rules:

1. The value provided to `env.account` when the stack is defined. This can
    either be a concrete account (e.g. `585695031111`) or the
    `Aws.ACCOUNT_ID` token.
3. `Aws.ACCOUNT_ID`, which represents the CloudFormation intrinsic reference
    `{ "Ref": "AWS::AccountId" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concerete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.account)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **account-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `artifactId`<sup>Required</sup> <a name="artifactId" id="aws-bootstrap-kit.AwsOrganizationsStack.property.artifactId"></a>

```typescript
public readonly artifactId: string;
```

- *Type:* string

The ID of the cloud assembly artifact for this stack.

---

##### `availabilityZones`<sup>Required</sup> <a name="availabilityZones" id="aws-bootstrap-kit.AwsOrganizationsStack.property.availabilityZones"></a>

```typescript
public readonly availabilityZones: string[];
```

- *Type:* string[]

Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack.

If the stack is environment-agnostic (either account and/or region are
tokens), this property will return an array with 2 tokens that will resolve
at deploy-time to the first two availability zones returned from CloudFormation's
`Fn::GetAZs` intrinsic function.

If they are not available in the context, returns a set of dummy values and
reports them as missing, and let the CLI resolve them by calling EC2
`DescribeAvailabilityZones` on the target environment.

To specify a different strategy for selecting availability zones override this method.

---

##### `bundlingRequired`<sup>Required</sup> <a name="bundlingRequired" id="aws-bootstrap-kit.AwsOrganizationsStack.property.bundlingRequired"></a>

```typescript
public readonly bundlingRequired: boolean;
```

- *Type:* boolean

Indicates whether the stack requires bundling or not.

---

##### `dependencies`<sup>Required</sup> <a name="dependencies" id="aws-bootstrap-kit.AwsOrganizationsStack.property.dependencies"></a>

```typescript
public readonly dependencies: Stack[];
```

- *Type:* aws-cdk-lib.Stack[]

Return the stacks this stack depends on.

---

##### `environment`<sup>Required</sup> <a name="environment" id="aws-bootstrap-kit.AwsOrganizationsStack.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The environment coordinates in which this stack is deployed.

In the form
`aws://account/region`. Use `stack.account` and `stack.region` to obtain
the specific values, no need to parse.

You can use this value to determine if two stacks are targeting the same
environment.

If either `stack.account` or `stack.region` are not concrete values (e.g.
`Aws.ACCOUNT_ID` or `Aws.REGION`) the special strings `unknown-account` and/or
`unknown-region` will be used respectively to indicate this stack is
region/account-agnostic.

---

##### `nested`<sup>Required</sup> <a name="nested" id="aws-bootstrap-kit.AwsOrganizationsStack.property.nested"></a>

```typescript
public readonly nested: boolean;
```

- *Type:* boolean

Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.

---

##### `notificationArns`<sup>Required</sup> <a name="notificationArns" id="aws-bootstrap-kit.AwsOrganizationsStack.property.notificationArns"></a>

```typescript
public readonly notificationArns: string[];
```

- *Type:* string[]

Returns the list of notification Amazon Resource Names (ARNs) for the current stack.

---

##### `partition`<sup>Required</sup> <a name="partition" id="aws-bootstrap-kit.AwsOrganizationsStack.property.partition"></a>

```typescript
public readonly partition: string;
```

- *Type:* string

The partition in which this stack is defined.

---

##### `region`<sup>Required</sup> <a name="region" id="aws-bootstrap-kit.AwsOrganizationsStack.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

The AWS region into which this stack will be deployed (e.g. `us-west-2`).

This value is resolved according to the following rules:

1. The value provided to `env.region` when the stack is defined. This can
    either be a concerete region (e.g. `us-west-2`) or the `Aws.REGION`
    token.
3. `Aws.REGION`, which is represents the CloudFormation intrinsic reference
    `{ "Ref": "AWS::Region" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concerete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.region)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **region-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `stackId`<sup>Required</sup> <a name="stackId" id="aws-bootstrap-kit.AwsOrganizationsStack.property.stackId"></a>

```typescript
public readonly stackId: string;
```

- *Type:* string

The ID of the stack.

---

*Example*

```typescript
// After resolving, looks like
'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'
```


##### `stackName`<sup>Required</sup> <a name="stackName" id="aws-bootstrap-kit.AwsOrganizationsStack.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

The concrete CloudFormation physical stack name.

This is either the name defined explicitly in the `stackName` prop or
allocated based on the stack's location in the construct tree. Stacks that
are directly defined under the app use their construct `id` as their stack
name. Stacks that are defined deeper within the tree will use a hashed naming
scheme based on the construct path to ensure uniqueness.

If you wish to obtain the deploy-time AWS::StackName intrinsic,
you can use `Aws.STACK_NAME` directly.

---

##### `synthesizer`<sup>Required</sup> <a name="synthesizer" id="aws-bootstrap-kit.AwsOrganizationsStack.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer

Synthesis method for this stack.

---

##### `tags`<sup>Required</sup> <a name="tags" id="aws-bootstrap-kit.AwsOrganizationsStack.property.tags"></a>

```typescript
public readonly tags: TagManager;
```

- *Type:* aws-cdk-lib.TagManager

Tags to be applied to the stack.

---

##### `templateFile`<sup>Required</sup> <a name="templateFile" id="aws-bootstrap-kit.AwsOrganizationsStack.property.templateFile"></a>

```typescript
public readonly templateFile: string;
```

- *Type:* string

The name of the CloudFormation template file emitted to the output directory during synthesis.

Example value: `MyStack.template.json`

---

##### `templateOptions`<sup>Required</sup> <a name="templateOptions" id="aws-bootstrap-kit.AwsOrganizationsStack.property.templateOptions"></a>

```typescript
public readonly templateOptions: ITemplateOptions;
```

- *Type:* aws-cdk-lib.ITemplateOptions

Options for CloudFormation template (like version, transform, description).

---

##### `urlSuffix`<sup>Required</sup> <a name="urlSuffix" id="aws-bootstrap-kit.AwsOrganizationsStack.property.urlSuffix"></a>

```typescript
public readonly urlSuffix: string;
```

- *Type:* string

The Amazon domain suffix for the region in which this stack is defined.

---

##### `nestedStackParent`<sup>Optional</sup> <a name="nestedStackParent" id="aws-bootstrap-kit.AwsOrganizationsStack.property.nestedStackParent"></a>

```typescript
public readonly nestedStackParent: Stack;
```

- *Type:* aws-cdk-lib.Stack

If this is a nested stack, returns it's parent stack.

---

##### `nestedStackResource`<sup>Optional</sup> <a name="nestedStackResource" id="aws-bootstrap-kit.AwsOrganizationsStack.property.nestedStackResource"></a>

```typescript
public readonly nestedStackResource: CfnResource;
```

- *Type:* aws-cdk-lib.CfnResource

If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource.

`undefined` for top-level (non-nested) stacks.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="aws-bootstrap-kit.AwsOrganizationsStack.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean

Whether termination protection is enabled for this stack.

---

##### `rootDns`<sup>Optional</sup> <a name="rootDns" id="aws-bootstrap-kit.AwsOrganizationsStack.property.rootDns"></a>

```typescript
public readonly rootDns: RootDns;
```

- *Type:* <a href="#aws-bootstrap-kit.RootDns">RootDns</a>

---


### CrossAccountDNSDelegator <a name="CrossAccountDNSDelegator" id="aws-bootstrap-kit.CrossAccountDNSDelegator"></a>

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

#### Initializers <a name="Initializers" id="aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer"></a>

```typescript
import { CrossAccountDNSDelegator } from 'aws-bootstrap-kit'

new CrossAccountDNSDelegator(scope: Construct, id: string, props: ICrossAccountDNSDelegatorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer.parameter.props">props</a></code> | <code><a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps">ICrossAccountDNSDelegatorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="aws-bootstrap-kit.CrossAccountDNSDelegator.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps">ICrossAccountDNSDelegatorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="aws-bootstrap-kit.CrossAccountDNSDelegator.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-bootstrap-kit.CrossAccountDNSDelegator.isConstruct"></a>

```typescript
import { CrossAccountDNSDelegator } from 'aws-bootstrap-kit'

CrossAccountDNSDelegator.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.CrossAccountDNSDelegator.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#aws-bootstrap-kit.CrossAccountDNSDelegator.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.HostedZone</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-bootstrap-kit.CrossAccountDNSDelegator.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="aws-bootstrap-kit.CrossAccountDNSDelegator.property.hostedZone"></a>

```typescript
public readonly hostedZone: HostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.HostedZone

---


### RootDns <a name="RootDns" id="aws-bootstrap-kit.RootDns"></a>

A class creating the main hosted zone and a role assumable by stages account to be able to set sub domain delegation.

#### Initializers <a name="Initializers" id="aws-bootstrap-kit.RootDns.Initializer"></a>

```typescript
import { RootDns } from 'aws-bootstrap-kit'

new RootDns(scope: Construct, id: string, props: RootDnsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.RootDns.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.RootDns.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.RootDns.Initializer.parameter.props">props</a></code> | <code><a href="#aws-bootstrap-kit.RootDnsProps">RootDnsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-bootstrap-kit.RootDns.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-bootstrap-kit.RootDns.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="aws-bootstrap-kit.RootDns.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-bootstrap-kit.RootDnsProps">RootDnsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.RootDns.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#aws-bootstrap-kit.RootDns.createDNSAutoUpdateRole">createDNSAutoUpdateRole</a></code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.RootDns.createRootHostedZone">createRootHostedZone</a></code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.RootDns.createStageSubZone">createStageSubZone</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="aws-bootstrap-kit.RootDns.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `createDNSAutoUpdateRole` <a name="createDNSAutoUpdateRole" id="aws-bootstrap-kit.RootDns.createDNSAutoUpdateRole"></a>

```typescript
public createDNSAutoUpdateRole(account: Account, stageSubZone: HostedZone): Role
```

###### `account`<sup>Required</sup> <a name="account" id="aws-bootstrap-kit.RootDns.createDNSAutoUpdateRole.parameter.account"></a>

- *Type:* <a href="#aws-bootstrap-kit.Account">Account</a>

---

###### `stageSubZone`<sup>Required</sup> <a name="stageSubZone" id="aws-bootstrap-kit.RootDns.createDNSAutoUpdateRole.parameter.stageSubZone"></a>

- *Type:* aws-cdk-lib.aws_route53.HostedZone

---

##### `createRootHostedZone` <a name="createRootHostedZone" id="aws-bootstrap-kit.RootDns.createRootHostedZone"></a>

```typescript
public createRootHostedZone(props: RootDnsProps): IHostedZone
```

###### `props`<sup>Required</sup> <a name="props" id="aws-bootstrap-kit.RootDns.createRootHostedZone.parameter.props"></a>

- *Type:* <a href="#aws-bootstrap-kit.RootDnsProps">RootDnsProps</a>

---

##### `createStageSubZone` <a name="createStageSubZone" id="aws-bootstrap-kit.RootDns.createStageSubZone"></a>

```typescript
public createStageSubZone(account: Account, rootHostedZoneDNSName: string): HostedZone
```

###### `account`<sup>Required</sup> <a name="account" id="aws-bootstrap-kit.RootDns.createStageSubZone.parameter.account"></a>

- *Type:* <a href="#aws-bootstrap-kit.Account">Account</a>

---

###### `rootHostedZoneDNSName`<sup>Required</sup> <a name="rootHostedZoneDNSName" id="aws-bootstrap-kit.RootDns.createStageSubZone.parameter.rootHostedZoneDNSName"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.RootDns.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-bootstrap-kit.RootDns.isConstruct"></a>

```typescript
import { RootDns } from 'aws-bootstrap-kit'

RootDns.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.RootDns.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.RootDns.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#aws-bootstrap-kit.RootDns.property.rootHostedZone">rootHostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.RootDns.property.stagesHostedZones">stagesHostedZones</a></code> | <code>aws-cdk-lib.aws_route53.HostedZone[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-bootstrap-kit.RootDns.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `rootHostedZone`<sup>Required</sup> <a name="rootHostedZone" id="aws-bootstrap-kit.RootDns.property.rootHostedZone"></a>

```typescript
public readonly rootHostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---

##### `stagesHostedZones`<sup>Required</sup> <a name="stagesHostedZones" id="aws-bootstrap-kit.RootDns.property.stagesHostedZones"></a>

```typescript
public readonly stagesHostedZones: HostedZone[];
```

- *Type:* aws-cdk-lib.aws_route53.HostedZone[]

---


### SecureRootUser <a name="SecureRootUser" id="aws-bootstrap-kit.SecureRootUser"></a>

#### Initializers <a name="Initializers" id="aws-bootstrap-kit.SecureRootUser.Initializer"></a>

```typescript
import { SecureRootUser } from 'aws-bootstrap-kit'

new SecureRootUser(scope: Construct, id: string, notificationEmail: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.SecureRootUser.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.SecureRootUser.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-bootstrap-kit.SecureRootUser.Initializer.parameter.notificationEmail">notificationEmail</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-bootstrap-kit.SecureRootUser.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-bootstrap-kit.SecureRootUser.Initializer.parameter.id"></a>

- *Type:* string

---

##### `notificationEmail`<sup>Required</sup> <a name="notificationEmail" id="aws-bootstrap-kit.SecureRootUser.Initializer.parameter.notificationEmail"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.SecureRootUser.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="aws-bootstrap-kit.SecureRootUser.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.SecureRootUser.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-bootstrap-kit.SecureRootUser.isConstruct"></a>

```typescript
import { SecureRootUser } from 'aws-bootstrap-kit'

SecureRootUser.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.SecureRootUser.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.SecureRootUser.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-bootstrap-kit.SecureRootUser.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### ValidateEmail <a name="ValidateEmail" id="aws-bootstrap-kit.ValidateEmail"></a>

Email Validation.

#### Initializers <a name="Initializers" id="aws-bootstrap-kit.ValidateEmail.Initializer"></a>

```typescript
import { ValidateEmail } from 'aws-bootstrap-kit'

new ValidateEmail(scope: Construct, id: string, props: ValidateEmailProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.ValidateEmail.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The parent Construct instantiating this construct. |
| <code><a href="#aws-bootstrap-kit.ValidateEmail.Initializer.parameter.id">id</a></code> | <code>string</code> | This instance name. |
| <code><a href="#aws-bootstrap-kit.ValidateEmail.Initializer.parameter.props">props</a></code> | <code><a href="#aws-bootstrap-kit.ValidateEmailProps">ValidateEmailProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-bootstrap-kit.ValidateEmail.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent Construct instantiating this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="aws-bootstrap-kit.ValidateEmail.Initializer.parameter.id"></a>

- *Type:* string

This instance name.

---

##### `props`<sup>Required</sup> <a name="props" id="aws-bootstrap-kit.ValidateEmail.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-bootstrap-kit.ValidateEmailProps">ValidateEmailProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.ValidateEmail.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="aws-bootstrap-kit.ValidateEmail.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.ValidateEmail.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-bootstrap-kit.ValidateEmail.isConstruct"></a>

```typescript
import { ValidateEmail } from 'aws-bootstrap-kit'

ValidateEmail.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-bootstrap-kit.ValidateEmail.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.ValidateEmail.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-bootstrap-kit.ValidateEmail.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### AccountSpec <a name="AccountSpec" id="aws-bootstrap-kit.AccountSpec"></a>

AWS Account input details.

#### Initializer <a name="Initializer" id="aws-bootstrap-kit.AccountSpec.Initializer"></a>

```typescript
import { AccountSpec } from 'aws-bootstrap-kit'

const accountSpec: AccountSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.name">name</a></code> | <code>string</code> | The name of the AWS account. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.email">email</a></code> | <code>string</code> | The email associated to the AWS account. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.existingAccountId">existingAccountId</a></code> | <code>string</code> | The (optional) id of the account to reuse, instead of creating a new account. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.hostedServices">hostedServices</a></code> | <code>string[]</code> | List of your services that will be hosted in this account. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.removalPolicy">removalPolicy</a></code> | <code>aws-cdk-lib.RemovalPolicy</code> | RemovalPolicy of the account (wether it must be retained or destroyed). See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.stageName">stageName</a></code> | <code>string</code> | The (optional) Stage name to be used in CI/CD pipeline. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.stageOrder">stageOrder</a></code> | <code>number</code> | The (optional) Stage deployment order. |
| <code><a href="#aws-bootstrap-kit.AccountSpec.property.type">type</a></code> | <code><a href="#aws-bootstrap-kit.AccountType">AccountType</a></code> | The account type. |

---

##### `name`<sup>Required</sup> <a name="name" id="aws-bootstrap-kit.AccountSpec.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the AWS account.

---

##### `email`<sup>Optional</sup> <a name="email" id="aws-bootstrap-kit.AccountSpec.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

The email associated to the AWS account.

---

##### `existingAccountId`<sup>Optional</sup> <a name="existingAccountId" id="aws-bootstrap-kit.AccountSpec.property.existingAccountId"></a>

```typescript
public readonly existingAccountId: string;
```

- *Type:* string

The (optional) id of the account to reuse, instead of creating a new account.

---

##### `hostedServices`<sup>Optional</sup> <a name="hostedServices" id="aws-bootstrap-kit.AccountSpec.property.hostedServices"></a>

```typescript
public readonly hostedServices: string[];
```

- *Type:* string[]

List of your services that will be hosted in this account.

Set it to [ALL] if you don't plan to have dedicated account for each service.

---

##### `removalPolicy`<sup>Optional</sup> <a name="removalPolicy" id="aws-bootstrap-kit.AccountSpec.property.removalPolicy"></a>

```typescript
public readonly removalPolicy: RemovalPolicy;
```

- *Type:* aws-cdk-lib.RemovalPolicy
- *Default:* RemovalPolicy.RETAIN

RemovalPolicy of the account (wether it must be retained or destroyed). See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options.

As an account cannot be deleted, RETAIN is the default value.

If you choose DESTROY instead (default behavior of CloudFormation), the stack deletion will fail and
you will have to manually remove the account from the organization before retrying to delete the stack:
https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_remove.html

Note that existing accounts (when using `existingAccountId`) are retained whatever the removalPolicy is.

---

##### `stageName`<sup>Optional</sup> <a name="stageName" id="aws-bootstrap-kit.AccountSpec.property.stageName"></a>

```typescript
public readonly stageName: string;
```

- *Type:* string

The (optional) Stage name to be used in CI/CD pipeline.

---

##### `stageOrder`<sup>Optional</sup> <a name="stageOrder" id="aws-bootstrap-kit.AccountSpec.property.stageOrder"></a>

```typescript
public readonly stageOrder: number;
```

- *Type:* number

The (optional) Stage deployment order.

---

##### `type`<sup>Optional</sup> <a name="type" id="aws-bootstrap-kit.AccountSpec.property.type"></a>

```typescript
public readonly type: AccountType;
```

- *Type:* <a href="#aws-bootstrap-kit.AccountType">AccountType</a>

The account type.

---

### AwsOrganizationsStackProps <a name="AwsOrganizationsStackProps" id="aws-bootstrap-kit.AwsOrganizationsStackProps"></a>

Properties for AWS SDLC Organizations Stack.

#### Initializer <a name="Initializer" id="aws-bootstrap-kit.AwsOrganizationsStackProps.Initializer"></a>

```typescript
import { AwsOrganizationsStackProps } from 'aws-bootstrap-kit'

const awsOrganizationsStackProps: AwsOrganizationsStackProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.analyticsReporting">analyticsReporting</a></code> | <code>boolean</code> | Include runtime versioning information in this Stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.crossRegionReferences">crossRegionReferences</a></code> | <code>boolean</code> | Enable this flag to allow native cross region stack references. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.description">description</a></code> | <code>string</code> | A description of the stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.env">env</a></code> | <code>aws-cdk-lib.Environment</code> | The AWS environment (account/region) where this stack will be deployed. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.PermissionsBoundary</code> | Options for applying a permissions boundary to all IAM Roles and Users created within this Stage. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.stackName">stackName</a></code> | <code>string</code> | Name to deploy the stack with. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method to use while deploying this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Stack tags that will be applied to all the taggable resources and the stack itself. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether to enable termination protection for this stack. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.email">email</a></code> | <code>string</code> | Email address of the Root account. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.nestedOU">nestedOU</a></code> | <code><a href="#aws-bootstrap-kit.OUSpec">OUSpec</a>[]</code> | Specification of the sub Organizational Unit. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.existingRootHostedZoneId">existingRootHostedZoneId</a></code> | <code>string</code> | The (optional) existing root hosted zone id to use instead of creating one. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.forceEmailVerification">forceEmailVerification</a></code> | <code>boolean</code> | Enable Email Verification Process. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.rootHostedZoneDNSName">rootHostedZoneDNSName</a></code> | <code>string</code> | The main DNS domain name to manage. |
| <code><a href="#aws-bootstrap-kit.AwsOrganizationsStackProps.property.thirdPartyProviderDNSUsed">thirdPartyProviderDNSUsed</a></code> | <code>boolean</code> | A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party. |

---

##### `analyticsReporting`<sup>Optional</sup> <a name="analyticsReporting" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.analyticsReporting"></a>

```typescript
public readonly analyticsReporting: boolean;
```

- *Type:* boolean
- *Default:* `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `crossRegionReferences`<sup>Optional</sup> <a name="crossRegionReferences" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.crossRegionReferences"></a>

```typescript
public readonly crossRegionReferences: boolean;
```

- *Type:* boolean
- *Default:* false

Enable this flag to allow native cross region stack references.

Enabling this will create a CloudFormation custom resource
in both the producing stack and consuming stack in order to perform the export/import

This feature is currently experimental

---

##### `description`<sup>Optional</sup> <a name="description" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="env" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.env"></a>

```typescript
public readonly env: Environment;
```

- *Type:* aws-cdk-lib.Environment
- *Default:* The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.

The AWS environment (account/region) where this stack will be deployed.

Set the `region`/`account` fields of `env` to either a concrete value to
select the indicated environment (recommended for production stacks), or to
the values of environment variables
`CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
depend on the AWS credentials/configuration that the CDK CLI is executed
under (recommended for development stacks).

If the `Stack` is instantiated inside a `Stage`, any undefined
`region`/`account` fields from `env` will default to the same field on the
encompassing `Stage`, if configured there.

If either `region` or `account` are not set nor inherited from `Stage`, the
Stack will be considered "*environment-agnostic*"". Environment-agnostic
stacks can be deployed to any environment but may not be able to take
advantage of all features of the CDK. For example, they will not be able to
use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
automatically translate Service Principals to the right format based on the
environment's AWS partition, and other such enhancements.

---

*Example*

```typescript
// Use a concrete account and region to deploy this stack to:
// `.account` and `.region` will simply return these values.
new Stack(app, 'Stack1', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  },
});

// Use the CLI's current credentials to determine the target environment:
// `.account` and `.region` will reflect the account+region the CLI
// is configured to use (based on the user CLI credentials)
new Stack(app, 'Stack2', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});

// Define multiple stacks stage associated with an environment
const myStage = new Stage(app, 'MyStage', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  }
});

// both of these stacks will use the stage's account/region:
// `.account` and `.region` will resolve to the concrete values as above
new MyStack(myStage, 'Stack1');
new YourStack(myStage, 'Stack2');

// Define an environment-agnostic stack:
// `.account` and `.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }` respectively.
// which will only resolve to actual values by CloudFormation during deployment.
new MyStack(app, 'Stack1');
```


##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* aws-cdk-lib.PermissionsBoundary
- *Default:* no permissions boundary is applied

Options for applying a permissions boundary to all IAM Roles and Users created within this Stage.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `synthesizer`<sup>Optional</sup> <a name="synthesizer" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer
- *Default:* `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.

Synthesis method to use while deploying this stack.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

Stack tags that will be applied to all the taggable resources and the stack itself.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `email`<sup>Required</sup> <a name="email" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

Email address of the Root account.

---

##### `nestedOU`<sup>Required</sup> <a name="nestedOU" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.nestedOU"></a>

```typescript
public readonly nestedOU: OUSpec[];
```

- *Type:* <a href="#aws-bootstrap-kit.OUSpec">OUSpec</a>[]

Specification of the sub Organizational Unit.

---

##### `existingRootHostedZoneId`<sup>Optional</sup> <a name="existingRootHostedZoneId" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.existingRootHostedZoneId"></a>

```typescript
public readonly existingRootHostedZoneId: string;
```

- *Type:* string

The (optional) existing root hosted zone id to use instead of creating one.

---

##### `forceEmailVerification`<sup>Optional</sup> <a name="forceEmailVerification" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.forceEmailVerification"></a>

```typescript
public readonly forceEmailVerification: boolean;
```

- *Type:* boolean

Enable Email Verification Process.

---

##### `rootHostedZoneDNSName`<sup>Optional</sup> <a name="rootHostedZoneDNSName" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.rootHostedZoneDNSName"></a>

```typescript
public readonly rootHostedZoneDNSName: string;
```

- *Type:* string

The main DNS domain name to manage.

---

##### `thirdPartyProviderDNSUsed`<sup>Optional</sup> <a name="thirdPartyProviderDNSUsed" id="aws-bootstrap-kit.AwsOrganizationsStackProps.property.thirdPartyProviderDNSUsed"></a>

```typescript
public readonly thirdPartyProviderDNSUsed: boolean;
```

- *Type:* boolean

A boolean used to decide if domain should be requested through this delpoyment or if already registered through a third party.

---

### OUSpec <a name="OUSpec" id="aws-bootstrap-kit.OUSpec"></a>

Organizational Unit Input details.

#### Initializer <a name="Initializer" id="aws-bootstrap-kit.OUSpec.Initializer"></a>

```typescript
import { OUSpec } from 'aws-bootstrap-kit'

const oUSpec: OUSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.OUSpec.property.name">name</a></code> | <code>string</code> | Name of the Organizational Unit. |
| <code><a href="#aws-bootstrap-kit.OUSpec.property.accounts">accounts</a></code> | <code><a href="#aws-bootstrap-kit.AccountSpec">AccountSpec</a>[]</code> | Accounts' specification inside in this Organizational Unit. |
| <code><a href="#aws-bootstrap-kit.OUSpec.property.nestedOU">nestedOU</a></code> | <code><a href="#aws-bootstrap-kit.OUSpec">OUSpec</a>[]</code> | Specification of sub Organizational Unit. |

---

##### `name`<sup>Required</sup> <a name="name" id="aws-bootstrap-kit.OUSpec.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of the Organizational Unit.

---

##### `accounts`<sup>Optional</sup> <a name="accounts" id="aws-bootstrap-kit.OUSpec.property.accounts"></a>

```typescript
public readonly accounts: AccountSpec[];
```

- *Type:* <a href="#aws-bootstrap-kit.AccountSpec">AccountSpec</a>[]

Accounts' specification inside in this Organizational Unit.

---

##### `nestedOU`<sup>Optional</sup> <a name="nestedOU" id="aws-bootstrap-kit.OUSpec.property.nestedOU"></a>

```typescript
public readonly nestedOU: OUSpec[];
```

- *Type:* <a href="#aws-bootstrap-kit.OUSpec">OUSpec</a>[]

Specification of sub Organizational Unit.

---

### RootDnsProps <a name="RootDnsProps" id="aws-bootstrap-kit.RootDnsProps"></a>

Properties for RootDns.

#### Initializer <a name="Initializer" id="aws-bootstrap-kit.RootDnsProps.Initializer"></a>

```typescript
import { RootDnsProps } from 'aws-bootstrap-kit'

const rootDnsProps: RootDnsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.RootDnsProps.property.rootHostedZoneDNSName">rootHostedZoneDNSName</a></code> | <code>string</code> | The top level domain name. |
| <code><a href="#aws-bootstrap-kit.RootDnsProps.property.stagesAccounts">stagesAccounts</a></code> | <code><a href="#aws-bootstrap-kit.Account">Account</a>[]</code> | The stages Accounts taht will need their subzone delegation. |
| <code><a href="#aws-bootstrap-kit.RootDnsProps.property.existingRootHostedZoneId">existingRootHostedZoneId</a></code> | <code>string</code> | The (optional) existing root hosted zone id to use instead of creating one. |
| <code><a href="#aws-bootstrap-kit.RootDnsProps.property.thirdPartyProviderDNSUsed">thirdPartyProviderDNSUsed</a></code> | <code>boolean</code> | A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported). |

---

##### `rootHostedZoneDNSName`<sup>Required</sup> <a name="rootHostedZoneDNSName" id="aws-bootstrap-kit.RootDnsProps.property.rootHostedZoneDNSName"></a>

```typescript
public readonly rootHostedZoneDNSName: string;
```

- *Type:* string

The top level domain name.

---

##### `stagesAccounts`<sup>Required</sup> <a name="stagesAccounts" id="aws-bootstrap-kit.RootDnsProps.property.stagesAccounts"></a>

```typescript
public readonly stagesAccounts: Account[];
```

- *Type:* <a href="#aws-bootstrap-kit.Account">Account</a>[]

The stages Accounts taht will need their subzone delegation.

---

##### `existingRootHostedZoneId`<sup>Optional</sup> <a name="existingRootHostedZoneId" id="aws-bootstrap-kit.RootDnsProps.property.existingRootHostedZoneId"></a>

```typescript
public readonly existingRootHostedZoneId: string;
```

- *Type:* string

The (optional) existing root hosted zone id to use instead of creating one.

---

##### `thirdPartyProviderDNSUsed`<sup>Optional</sup> <a name="thirdPartyProviderDNSUsed" id="aws-bootstrap-kit.RootDnsProps.property.thirdPartyProviderDNSUsed"></a>

```typescript
public readonly thirdPartyProviderDNSUsed: boolean;
```

- *Type:* boolean

A boolean indicating if Domain name has already been registered to a third party or if you want this contruct to create it (the latter is not yet supported).

---

### ValidateEmailProps <a name="ValidateEmailProps" id="aws-bootstrap-kit.ValidateEmailProps"></a>

Properties of ValidateEmail.

#### Initializer <a name="Initializer" id="aws-bootstrap-kit.ValidateEmailProps.Initializer"></a>

```typescript
import { ValidateEmailProps } from 'aws-bootstrap-kit'

const validateEmailProps: ValidateEmailProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.ValidateEmailProps.property.email">email</a></code> | <code>string</code> | Email address of the Root account. |
| <code><a href="#aws-bootstrap-kit.ValidateEmailProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `email`<sup>Required</sup> <a name="email" id="aws-bootstrap-kit.ValidateEmailProps.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

Email address of the Root account.

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="aws-bootstrap-kit.ValidateEmailProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IAccountProps <a name="IAccountProps" id="aws-bootstrap-kit.IAccountProps"></a>

- *Implemented By:* <a href="#aws-bootstrap-kit.IAccountProps">IAccountProps</a>

Properties of an AWS account.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.email">email</a></code> | <code>string</code> | The email to use to create the AWS account. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.name">name</a></code> | <code>string</code> | The name of the AWS Account. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.hostedServices">hostedServices</a></code> | <code>string[]</code> | List of your services that will be hosted in this account. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.id">id</a></code> | <code>string</code> | The AWS account Id. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.parentOrganizationalUnitId">parentOrganizationalUnitId</a></code> | <code>string</code> | The potential Organizational Unit Id the account should be placed in. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.parentOrganizationalUnitName">parentOrganizationalUnitName</a></code> | <code>string</code> | The potential Organizational Unit Name the account should be placed in. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.removalPolicy">removalPolicy</a></code> | <code>aws-cdk-lib.RemovalPolicy</code> | RemovalPolicy of the account. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.stageName">stageName</a></code> | <code>string</code> | The (optional) Stage name to be used in CI/CD pipeline. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.stageOrder">stageOrder</a></code> | <code>number</code> | The (optional) Stage deployment order. |
| <code><a href="#aws-bootstrap-kit.IAccountProps.property.type">type</a></code> | <code><a href="#aws-bootstrap-kit.AccountType">AccountType</a></code> | The account type. |

---

##### `email`<sup>Required</sup> <a name="email" id="aws-bootstrap-kit.IAccountProps.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

The email to use to create the AWS account.

---

##### `name`<sup>Required</sup> <a name="name" id="aws-bootstrap-kit.IAccountProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the AWS Account.

---

##### `hostedServices`<sup>Optional</sup> <a name="hostedServices" id="aws-bootstrap-kit.IAccountProps.property.hostedServices"></a>

```typescript
public readonly hostedServices: string[];
```

- *Type:* string[]

List of your services that will be hosted in this account.

Set it to [ALL] if you don't plan to have dedicated account for each service.

---

##### `id`<sup>Optional</sup> <a name="id" id="aws-bootstrap-kit.IAccountProps.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

The AWS account Id.

---

##### `parentOrganizationalUnitId`<sup>Optional</sup> <a name="parentOrganizationalUnitId" id="aws-bootstrap-kit.IAccountProps.property.parentOrganizationalUnitId"></a>

```typescript
public readonly parentOrganizationalUnitId: string;
```

- *Type:* string

The potential Organizational Unit Id the account should be placed in.

---

##### `parentOrganizationalUnitName`<sup>Optional</sup> <a name="parentOrganizationalUnitName" id="aws-bootstrap-kit.IAccountProps.property.parentOrganizationalUnitName"></a>

```typescript
public readonly parentOrganizationalUnitName: string;
```

- *Type:* string

The potential Organizational Unit Name the account should be placed in.

---

##### `removalPolicy`<sup>Optional</sup> <a name="removalPolicy" id="aws-bootstrap-kit.IAccountProps.property.removalPolicy"></a>

```typescript
public readonly removalPolicy: RemovalPolicy;
```

- *Type:* aws-cdk-lib.RemovalPolicy
- *Default:* RemovalPolicy.RETAIN

RemovalPolicy of the account.

See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options

---

##### `stageName`<sup>Optional</sup> <a name="stageName" id="aws-bootstrap-kit.IAccountProps.property.stageName"></a>

```typescript
public readonly stageName: string;
```

- *Type:* string

The (optional) Stage name to be used in CI/CD pipeline.

---

##### `stageOrder`<sup>Optional</sup> <a name="stageOrder" id="aws-bootstrap-kit.IAccountProps.property.stageOrder"></a>

```typescript
public readonly stageOrder: number;
```

- *Type:* number

The (optional) Stage deployment order.

---

##### `type`<sup>Optional</sup> <a name="type" id="aws-bootstrap-kit.IAccountProps.property.type"></a>

```typescript
public readonly type: AccountType;
```

- *Type:* <a href="#aws-bootstrap-kit.AccountType">AccountType</a>

The account type.

---

### ICrossAccountDNSDelegatorProps <a name="ICrossAccountDNSDelegatorProps" id="aws-bootstrap-kit.ICrossAccountDNSDelegatorProps"></a>

- *Implemented By:* <a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps">ICrossAccountDNSDelegatorProps</a>

Properties to create delegated subzone of a zone hosted in a different account.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.zoneName">zoneName</a></code> | <code>string</code> | The sub zone name to be created. |
| <code><a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.targetAccount">targetAccount</a></code> | <code>string</code> | The Account hosting the parent zone Optional since can be resolved if the system has been setup with aws-bootstrap-kit. |
| <code><a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.targetHostedZoneId">targetHostedZoneId</a></code> | <code>string</code> | The parent zone Id to add the sub zone delegation NS record to Optional since can be resolved if the system has been setup with aws-bootstrap-kit. |
| <code><a href="#aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.targetRoleToAssume">targetRoleToAssume</a></code> | <code>string</code> | The role to Assume in the parent zone's account which has permissions to update the parent zone Optional since can be resolved if the system has been setup with aws-bootstrap-kit. |

---

##### `zoneName`<sup>Required</sup> <a name="zoneName" id="aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.zoneName"></a>

```typescript
public readonly zoneName: string;
```

- *Type:* string

The sub zone name to be created.

---

##### `targetAccount`<sup>Optional</sup> <a name="targetAccount" id="aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.targetAccount"></a>

```typescript
public readonly targetAccount: string;
```

- *Type:* string

The Account hosting the parent zone Optional since can be resolved if the system has been setup with aws-bootstrap-kit.

---

##### `targetHostedZoneId`<sup>Optional</sup> <a name="targetHostedZoneId" id="aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.targetHostedZoneId"></a>

```typescript
public readonly targetHostedZoneId: string;
```

- *Type:* string

The parent zone Id to add the sub zone delegation NS record to Optional since can be resolved if the system has been setup with aws-bootstrap-kit.

---

##### `targetRoleToAssume`<sup>Optional</sup> <a name="targetRoleToAssume" id="aws-bootstrap-kit.ICrossAccountDNSDelegatorProps.property.targetRoleToAssume"></a>

```typescript
public readonly targetRoleToAssume: string;
```

- *Type:* string

The role to Assume in the parent zone's account which has permissions to update the parent zone Optional since can be resolved if the system has been setup with aws-bootstrap-kit.

---

## Enums <a name="Enums" id="Enums"></a>

### AccountType <a name="AccountType" id="aws-bootstrap-kit.AccountType"></a>

The type of the AWS account.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-bootstrap-kit.AccountType.CICD">CICD</a></code> | The account used to deploy CI/CD pipelines (See [here](https://cs.github.com/?scopeName=bk&scope=repo%3Aawslabs%2Faws-bootstrap-kit&q=AccountType.CICD) for internal usage). |
| <code><a href="#aws-bootstrap-kit.AccountType.STAGE">STAGE</a></code> | Accounts which will be used to deploy Stage environments (staging/prod ...). (See [here](https://cs.github.com/?scopeName=bk&scope=repo%3Aawslabs%2Faws-bootstrap-kit&q=AccountType.STAGE) for internal usage). |
| <code><a href="#aws-bootstrap-kit.AccountType.PLAYGROUND">PLAYGROUND</a></code> | Sandbox accounts dedicated to developers work. |

---

##### `CICD` <a name="CICD" id="aws-bootstrap-kit.AccountType.CICD"></a>

The account used to deploy CI/CD pipelines (See [here](https://cs.github.com/?scopeName=bk&scope=repo%3Aawslabs%2Faws-bootstrap-kit&q=AccountType.CICD) for internal usage).

---


##### `STAGE` <a name="STAGE" id="aws-bootstrap-kit.AccountType.STAGE"></a>

Accounts which will be used to deploy Stage environments (staging/prod ...). (See [here](https://cs.github.com/?scopeName=bk&scope=repo%3Aawslabs%2Faws-bootstrap-kit&q=AccountType.STAGE) for internal usage).

---


##### `PLAYGROUND` <a name="PLAYGROUND" id="aws-bootstrap-kit.AccountType.PLAYGROUND"></a>

Sandbox accounts dedicated to developers work.

---

