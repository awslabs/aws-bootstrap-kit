# AWS SSO credential sync for CDK

JS version of https://www.matscloud.com/blog/2020/06/25/how-to-use-aws-cdk-with-aws-sso-profiles/ working around https://github.com/aws/aws-cdk/issues/5455 issue.

## Usage

After sso login with `aws sso login --profile <YOUR PROFILE NAME>` just run `cdk-sso-sync <YOUR PROFILE NAME>` to be able to use CDK with the same profile (`cdk deploy --profile <YOUR PROFILE NAME>`)