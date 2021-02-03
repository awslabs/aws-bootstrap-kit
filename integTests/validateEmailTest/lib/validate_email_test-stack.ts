import * as cdk from "@aws-cdk/core";
import * as bootstrapKit from "aws-bootstrap-kit/lib/index.js";

export class ValidateEmailTestStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        new bootstrapKit.ValidateEmail(
            this,
            "TestEmailValidationFailingShouldRollbackProperly",
            {
              // Will bounce with 550 SMTP error equivalent to what a an email provider that does not support address aliases
              // @see https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-simulator.html for more details
              email: "bounce@simulator.amazonses.com",
              timeout: cdk.Duration.seconds(30)
            }
        );
    }
}
