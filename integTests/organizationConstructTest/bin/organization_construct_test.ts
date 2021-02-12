#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { OrganizationConstructTestStack } from '../lib/organization_construct_test-stack';

const app = new cdk.App();
new OrganizationConstructTestStack(app, 'OrganizationConstructTestStack');
