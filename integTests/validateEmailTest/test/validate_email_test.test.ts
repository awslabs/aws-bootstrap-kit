import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ValidateEmailTest from '../lib/validate_email_test-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ValidateEmailTest.ValidateEmailTestStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
