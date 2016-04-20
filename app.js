'use strict';

var platform = require('./platform'),
    isPlainObject = require('lodash.isplainobject'),
    isArray = require('lodash.isarray'),
    async = require('async'),
	sqs, queueUrl;

let sendData = (data, callback) => {
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
        if(!error){
            platform.log(JSON.stringify({
                title: 'AWS SQS message saved.',
                data: data
            }));
        }

        callback(error);
    });
};

platform.on('data', function (data) {
	if(isPlainObject(data)){
        sendData(data, (error) => {
            console.error(error);
            platform.handleException(error);
        });
    }
    else if(isArray(data)){
        async.each(data, (datum, done) => {
            sendData(datum, done);
        }, (error) => {
            console.error(error);
            platform.handleException(error);
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data));
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