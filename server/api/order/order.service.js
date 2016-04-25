'use strict'

var paymentPlanModel = require('./paymentPlan/paymentPlan.model').paymentPlanModel
var orderModel = require('./order.model').orderModel;

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

function searchOrder(param, cb) {

  orderModel.find(
      {$text: {$search: param}},
      {score: {$meta: "textScore"}}
    ).sort({score: {$meta: 'textScore'}}).exec(function (err, results) {
    if (err) {
      return cb(err);
    }
    cb(null, results);
  });

}

exports.createPayments = createPayments;
exports.searchOrder = searchOrder;
