'use strict'

var paymentPlanModel = require('./paymentPlan/paymentPlan.model').paymentPlanModel

function createPayments (paymentsList) {
  if (!paymentsList.length) {
    return []
  }
  return paymentsList.map(function (paymentPlan) {
    return new paymentPlanModel(paymentPlan)
  }).filter(function (paymentPlan) {
    return paymentPlan.price && paymentPlan.dateCharge
  })
}

exports.createPayments = createPayments