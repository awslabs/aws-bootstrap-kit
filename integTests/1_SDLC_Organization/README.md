# 1 Software Development Life Cycle Organization

This a clone of https://github.com/aws-samples/aws-bootstrap-kit-examples/tree/main/source/1-SDLC-organization.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


## Local run

Before sending a Pull Request, run this to validate your change

(Those steps reproduce the procedure automated in `cicd-stack.ts`)

1. build
    ```
    cd ../../source/aws-bootstrap-kit/ && npm install && npm run build && npm run js-package && cd - && npm install
    ```
1. deploy without pipeline
    ```
    npm run cdk synth -- --profile main-admin
    npm run cdk deploy -- --profile main-admin -a cdk.out/assembly-Prod
    ```
