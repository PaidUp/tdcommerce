'use strict'
let proxyquire = require('proxyquire')
let test = require('tape')
let orderService = require('./order.service')
let paymentPlanModelSpec = require('./paymentPlan/paymentPlan.model.spec')
// https://github.com/substack/tape
// https://github.com/aghassemi/tap-xunit
// https://www.npmjs.com/package/proxyquire

test('order.service createPayments', function (t) {
  // const createPaymentsStub = function (input, cb) {
  // return [{status:'pending'}]
  // }

  // let createPayments = proxyquire('./order.service', {
  // 'request': createPaymentsStub
  // })
  let test = paymentPlanModelSpec.PyamentPlan()
  console.log('test', test)
  orderService.createPayments([{'status': 'pending'}], function (err, data) {
    console.log('err', err)
    console.log('data', data)
    t.equal(err, null)
    t.equal(data, 'cogollo')
    t.end()
  })
})
