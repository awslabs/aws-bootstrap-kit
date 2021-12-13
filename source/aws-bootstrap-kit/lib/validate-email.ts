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

import {Construct} from 'constructs';
import { CustomResource, Duration } from "aws-cdk-lib";
import ValidateEmailProvider from "./validate-email-provider";

/**
 * Properties of ValidateEmail
 */
export interface ValidateEmailProps {
  /**
   * Email address of the Root account
   */
  readonly email: string;
  readonly timeout?: Duration;
}

/**
 * Email Validation
 */
export class ValidateEmail extends Construct {
  /**
   * Constructor
   *
   * @param scope The parent Construct instantiating this construct
   * @param id This instance name
   * @param accountProps ValidateEmail properties
   */
  constructor(scope: Construct, id: string, props: ValidateEmailProps) {
    super(scope, id);

    const [prefix, domain] = props.email.split("@");

    if (prefix?.includes("+")) {
      throw new Error("Root Email should be without + in it");
    }

    const subAddressedEmail = prefix + "+aws@" + domain;

    const { provider } = ValidateEmailProvider.getOrCreate(this, {timeout: props.timeout});

    new CustomResource(this, "EmailValidateResource", {
      serviceToken: provider.serviceToken,
      resourceType: "Custom::EmailValidation",
      properties: {
        email: subAddressedEmail
      }
    });
  }
}
