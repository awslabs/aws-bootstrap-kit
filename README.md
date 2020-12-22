# AWS Bootstrap Kit Overview

This is a strongly opinionated CDK set of constructs built for companies looking to follow AWS best practices on Day 1 while setting their development and deployment environment on AWS.

Let's start small but with potential for future growth without adding tech debt.

## Getting started

Check our [examples repo](https://github.com/aws-samples/aws-bootstrap-kit-examples)

## Constructs

As of today we expose only one global construct :

* [AWS BootstrapKit](./source/aws-bootstrap-kit/README.md)

## Clean up accounts

AWS Bootstrap Kit creates accounts (e.g CICD, DNS, Staging) through AWS Organization. Behind the scene, we use CloudFormation Custom Resource and AWS Lambda to create to call [CreateAccount API](https://docs.aws.amazon.com/organizations/latest/APIReference/API_CreateAccount.html). 

However, there is no API to delete and remove accounts. Thus, the accounts cannot be cleaned up automatically in via Custom Resources. We need to delete these accounts manually. The steps below explain how to clean up those accounts. You have to repeat these step for each account one by one.

1. **Ensure that you have access email address of the member account** Without access to email address, you cannot close the account. If that is the case, create [a Service Control Policy (SCP)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) with deny * on all resources and apply it to all accounts to disable all access.
2. **Recover root user access in the member account** Follow section "Accessing a member account as the root user" in [this documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html#orgs_manage_accounts_access-as-root). Keep the credential for later steps.
3. **Remove the member account from AWS Organization** Follow the instruction on this [documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_remove.html). In essence, you need to fill required information (e.g. billing) to detach the member account from an existing Organization.    
4. **Delete each account** Sign-in with root credential and goto [Account Setting page](https://console.aws.amazon.com/billing/home?#/account). Scroll down to "Close Account" section. Read and ensure that you understand the information on check box before closing the account. 
