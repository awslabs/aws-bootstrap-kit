# CONTRIBUTING

If you need to customize/fix/contribute to this jsii construct here is the doc:

### TL;DR for JS/TS CDK app

```
npm install && npm run build && npm run js-package
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
npm install
```

### build and test

The build script will compile to JSii and generate the API doc into [API.md](./API.md)
```
npm run build
```

```
npm run test
```

### Package

#### Package JS only

```
npm run js-package

```

#### All

```
npm run package
```

### Bump version

```
npm run release
```