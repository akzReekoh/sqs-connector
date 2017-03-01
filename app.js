'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isPlainObject = require('lodash.isplainobject')
let sqs = null

let sendData = (data, callback) => {
  let params = {
    MessageBody: JSON.stringify(data),
    QueueUrl: _plugin.config.queueUrl,
    MessageAttributes: {
      Attributes: {
        DataType: 'String',
        StringValue: JSON.stringify(data)
      }
    }
  }

  sqs.sendMessage(params, function (error) {
    if (!error) {
      _plugin.log(JSON.stringify({
        title: 'AWS SQS message saved.',
        data: data
      }))
    }

    callback(error)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  let AWS = require('aws-sdk')

  sqs = new AWS.SQS({
    accessKeyId: _plugin.config.accessKeyId,
    secretAccessKey: _plugin.config.secretAccessKey,
    region: _plugin.config.region,
    version: _plugin.config.apiVersion,
    sslEnabled: true
  })

  _plugin.log('SQS Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
