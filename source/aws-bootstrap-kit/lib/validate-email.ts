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

import {
  Construct,
  CustomResource
} from "@aws-cdk/core";
import ValidateEmailProvider from './validate-email-provider'


interface ValidateEmailProps {
  readonly email: string;
}

export default class ValidateEmail extends Construct {

  constructor(scope: Construct, id: string, props: ValidateEmailProps) {
    super(scope, id);

    const [prefix, domain] = props.email.split("@");

    if (prefix?.includes("+")) {
      throw new Error("Root Email should be without + in it");
    }

    const subAddressedEmail = prefix + "+aws@" + domain;

    const { provider } = ValidateEmailProvider.getOrCreate(this);

    new CustomResource(this, "EmailValidateResource", {
      serviceToken: provider.serviceToken,
      resourceType: "Custom::EmailValidation",
      properties: {
        email: subAddressedEmail
      }
    });
  }

}