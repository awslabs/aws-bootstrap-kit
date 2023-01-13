# CONTRIBUTING

If you need to customize/fix/contribute to this jsii construct here is the doc:

### TL;DR for JS/TS CDK app

```
npx projen && npx projen build && npx projen package:js
```
you end up with a tgz package into dist folder importable into your cdk app with the following lines in your package.json


```
"dependencies": {
...
    "aws-bootstrap-kit": "file:../../source/aws-bootstrap-kit/dist/js/aws-bootstrap-kit@0.2.4.jsii.tgz",
...
  }
```

### init

```
npx projen
```

### build and test

The build script will compile to JSii and generate the API doc into [API.md](./API.md)
```
npx projen build
```

```
npx projen test
```

### Package

#### Package JS only

```
npx projen package:js
```

#### All

```
npx projen package
```

### Bump version

```
npx projen release
```