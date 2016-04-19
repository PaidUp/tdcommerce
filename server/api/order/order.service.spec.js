/*
'use strict'
let proxyquire = require('proxyquire')
let test = require('tape')
let orderService = require('./order.service')
let paymentPlanModelSpec = require('./paymentPlan/paymentPlan.model.spec')
// https://github.com/substack/tape
// https://github.com/aghassemi/tap-xunit
// https://www.npmjs.com/package/proxyquire

test('order.service createPayments fail', function (t) {
  let test = { name: 'casa'}
  let pp = orderService.createPayments([test])
  t.deepEqual(pp, [])
  t.end()
})

test('order.service createPayments ok', function (t) {
  let test = paymentPlanModelSpec()
  let pp = orderService.createPayments([test])
  t.equal(pp.length, 1)
  t.equal(pp[0].account, 'account')
  t.equal(pp[0].typeAccount, 'typeAccount')
  t.equal(pp[0].processingFees.achFeeFlatDisplay, 0)
  t.equal(pp[0].processingFees.achFeeFlat, 0)
  t.equal(pp[0].processingFees.achFeeDisplay, 0)
  t.equal(pp[0].processingFees.achFee, 0)
  t.equal(pp[0].processingFees.cardFeeFlatDisplay, 0.3)
  t.equal(pp[0].processingFees.cardFeeFlat, 0.3)
  t.equal(pp[0].processingFees.cardFeeDisplay, 2.9)
  t.equal(pp[0].processingFees.cardFee, 2.9)
  t.end()
})

test('order.service createPayments one ok, one fail', function (t) {
  let testOk = paymentPlanModelSpec()
  let testFail = { name: 'casa'}
  let pp = orderService.createPayments([testOk, testFail])
  t.equal(pp.length, 1)
  t.end()
})
*/
// test('test demo', function (t) {
// const createPaymentsStub = function (input, cb) {
// return [{status:'pending'}]
// }

// let createPayments = proxyquire('./order.service', {
// 'request': createPaymentsStub
// })
// let testOk = paymentPlanModelSpec()
// let testFail = { name: 'casa'}
// let pp = orderService.createPayments([testOk, testFail])
// t.equal(pp.length, 1)
// t.end()
// })
