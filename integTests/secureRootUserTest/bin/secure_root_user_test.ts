#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SecureRootUserTestStack } from '../lib/secure_root_user_test-stack';

const app = new cdk.App();
new SecureRootUserTestStack(app, 'SecureRootUserTestStack');
