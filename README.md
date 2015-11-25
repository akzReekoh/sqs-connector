# AWS SQS Connector
[![Build Status](https://travis-ci.org/Reekoh/sqs-connector.svg)](https://travis-ci.org/Reekoh/sqs-connector)
![Dependencies](https://img.shields.io/david/Reekoh/sqs-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/sqs-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

AWS SQS Connector Plugin for the Reekoh IoT Platform. Integrates a Reekoh instance with AWS SQS to put a message in SQS queue.

## Description
This plugin saves all data from connected devices to the Reekoh Instance to AWS SQS message queue.

## Configuration
To configure this plugin, an Amazon AWS account and SQS Queue is needed to provide the following:

1. Access Key ID - AWS Access Key ID to use.
2. Secret Access Key - AWS Secret Access Key to use.
3. Region - AWS Region to use.
4. API Version - AWS API Version to use.
5. Queue URL - AWS SQS Queue URL to use.

These parameters are then injected to the plugin from the platform.