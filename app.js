'use strict';

var platform = require('./platform'),
    isPlainObject = require('lodash.isplainobject'),
	sqs, queueUrl;

platform.on('data', function (data) {
	if(isPlainObject(data)){
        var params = {
            MessageBody : JSON.stringify(data),
            QueueUrl : queueUrl,
            MessageAttributes :{
                Attributes:{
                    DataType : 'String',
                    StringValue : JSON.stringify(data)
                }
            }
        };

        sqs.sendMessage(params, function(error, response){
            if(error){
                console.error(error);
                platform.handleException(error);
            }
            else{
                platform.log(JSON.stringify({
                    title: 'AWS SQS message saved.',
                    data: data
                }));
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    var AWS = require('aws-sdk');

    queueUrl = options.queue_url;

    sqs = new AWS.SQS({
        accessKeyId: options.access_key_id,
        secretAccessKey: options.secret_access_key,
        region: options.region,
        version: options.api_version,
        sslEnabled: true
    });

    platform.log('AWS SQS Connector Initialized.');
	platform.notifyReady();
});