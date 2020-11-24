/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';

/**
 * A Custom Resource provider capable of creating a NS record with zone delegation
 * to the given name servers
 *
 * Note that there is no API to check the status of record creation.
 * Thus, we do not implement the `IsComplete` handler here.
 * The newly created record will be temporarily pending (a few seconds).
 */
export class CrossAccountZoneDelegationRecordProvider extends Construct {
    /**
     * The custom resource provider.
     */
    public readonly provider: cr.Provider;

    /**
     * The onEvent handler
     */
    public readonly onEventHandler: lambda.Function;

    constructor(scope: Construct, id: string, roleArnToAssume: string) {
        super(scope, id);

        const code = lambda.Code.fromAsset(path.join(__dirname, 'delegation-record-handler'));

        // Handle CREATE/UPDATE/DELETE cross account
        this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
            code,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.onEventHandler',
            timeout: Duration.minutes(5),
            description: 'Cross-account zone delegation record OnEventHandler'
        });

        // Allow to assume DNS account's updater role
        // roleArn, if not provided will be resolved in the lambda itself but still need to be allowed to assume it.
        this.onEventHandler.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ['sts:AssumeRole'],
                resources: [roleArnToAssume?roleArnToAssume:'arn:aws:iam:::role/*-dns-update'],
            })
        );

        //Allow to retrieve dynamically the zoneId and the target accountId
        this.onEventHandler.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ['route53:listHostedZonesByName', 'organizations:ListAccounts'],
                resources: ['*'],
            })
        );

        this.provider = new cr.Provider(this, 'CrossAccountZoneDelegationRecordProvider', {
            onEventHandler: this.onEventHandler,
        });
    }
}
