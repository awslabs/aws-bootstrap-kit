#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ValidateEmailTestStack } from '../lib/validate_email_test-stack';

const app = new cdk.App();
new ValidateEmailTestStack(app, 'ValidateEmailTestStack');
