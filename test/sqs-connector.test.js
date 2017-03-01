'use strict'

const amqp = require('amqplib')

const QUEUE_URL = 'https://sqs.us-west-2.amazonaws.com/821215833087/sqsPlugin'
const REGION = 'us-west-2'
const API_VERSION = '2012-11-05'
const ACCESS_KEY_ID = 'AKIAIOU2EZVMZ7DR44NQ'
const SECRET_ACCESS_KEY= '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'

let _channel = null
let _conn = null
let app = null

describe('SQS Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey : SECRET_ACCESS_KEY,
      region : REGION,
      apiVersion : API_VERSION,
      queueUrl : QUEUE_URL
    })
    process.env.INPUT_PIPE = 'ip.sqs'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        title : 'Test Message',
        message : 'This is a test message from AWS SQS Connector.'
      }

      _channel.sendToQueue('ip.sqs', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
