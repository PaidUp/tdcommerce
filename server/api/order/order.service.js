'use strict'

var paymentPlanModel = require('./paymentPlan/paymentPlan.model').paymentPlanModel
var orderModel = require('./order.model').orderModel

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

function searchOrder (param, cb) {
  orderModel.find(
    {$text: {$search: param}},
    {score: {$meta: 'textScore'}}
  ).sort({score: {$meta: 'textScore'}}).exec(function (err, results) {
    if (err) {
      return cb(err)
    }
    cb(null, results)
  })
}
// db.getCollection('orders').aggregate({ $match: { userId:'5644f60936c2f71c22b69267'} },{ $limit : 5 }, {$unwind:{path: "$paymentsPlan"}},{ $sort : {"paymentsPlan.dateCharge":-1} },{ $match: {"paymentsPlan.status":'pending'} })
function recent (params, cb) {
  let filter = params.userId ? {userId: params.userId, 'paymentsPlan.status': 'pending'} : {}
  orderModel
    .aggregate([{ $match: { userId: params.userId} }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, {$unwind: {path: '$paymentsPlan'}}, { $sort: {'paymentsPlan.dateCharge': -1} }, { $match: {'paymentsPlan.status': 'succeeded'} }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}

exports.createPayments = createPayments
exports.searchOrder = searchOrder
exports.recent = recent
