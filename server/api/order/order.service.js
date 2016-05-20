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
  ).sort({createAt: -1}).exec(function (err, results) {
    if (err) {
      return cb(err)
    }
    cb(null, results)
  })
}
// db.getCollection('orders').aggregate({ $match: { userId:'xxx'} },{ $limit : 5 }, {$unwind:{path: "$paymentsPlan"}},{ $sort : {"paymentsPlan.dateCharge":-1} },{ $match: {"paymentsPlan.status":'succeeded'} })
function recent (params, cb) {
  orderModel
    .aggregate([{ $match: { userId: params.userId} }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, {$unwind: {path: '$paymentsPlan'}}, { $sort: {'paymentsPlan.dateCharge': -1} }, { $match: {'paymentsPlan.status': {$ne: 'pending'} } }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}
// db.getCollection('orders').aggregate({ $match: { userId:'xxx', status:'active'} },{ $limit : 1 }, {$unwind:{path: "$paymentsPlan"}},{ $sort : {"paymentsPlan.dateCharge":1} },{ $match: {"paymentsPlan.status":'pending'} })
function next (params, cb) {
  orderModel
    .aggregate([{ $match: { userId: params.userId, status: 'active'} }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, {$unwind: {path: '$paymentsPlan'}}, { $sort: {'paymentsPlan.dateCharge': 1} }, { $match: {'paymentsPlan.status': 'pending'} }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}
// db.getCollection('orders').aggregate({ $match: { userId:'xxx', status:'active'} },{ $limit : 1 }, {$project:{ allProductName:'$paymentsPlan.productInfo.productName', allBeneficiaryName:'$paymentsPlan.beneficiaryInfo.beneficiaryName', status:true, paymentsPlan:true}})
function active (params, cb) {
  orderModel
    .aggregate([{ $match: { userId: params.userId, status: 'active'} }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, {$project: { allProductName: '$paymentsPlan.productInfo.productName', allBeneficiaryName: '$paymentsPlan.beneficiaryInfo.beneficiaryName', status: true, paymentsPlan: true}}])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}

// db.getCollection('orders').aggregate({ $match: {"paymentsPlan.productInfo.organizationId":'xxx'} },{ $limit : 1 }, {$project:{ sumoriginalPrice:{$sum: '$paymentsPlan.originalPrice'}, alloriginalPrice:'$paymentsPlan.originalPrice', allDiscount:'$paymentsPlan.discount',sumDiscount:{$sum: '$paymentsPlan.discount'}, sumPrice:{$sum: '$paymentsPlan.price'}, allPrice:'$paymentsPlan.price', allProductName:'$paymentsPlan.productInfo.productName', allBeneficiaryName:'$paymentsPlan.beneficiaryInfo.beneficiaryName', status:true, paymentsPlan:true, userId:true, orderId:true, updateAt:true, createAt:true}})
function getOrderOrganization (params, cb) {
  let sort = params.sort || -1
  let limit = params.limit || 1000
  let organizationId = params.organizationId || ''
  orderModel
    .aggregate([{ $match: {'paymentsPlan.productInfo.organizationId': organizationId} }, { $sort: {'paymentsPlan.dateCharge': (typeof sort === 'number') ? sort : parseInt(sort, 10)} }, { $limit: (typeof limit === 'number') ? limit : parseInt(limit, 10) }, {$project: { sumoriginalPrice: {$sum: '$paymentsPlan.originalPrice'}, alloriginalPrice: '$paymentsPlan.originalPrice', allDiscount: '$paymentsPlan.discount',sumDiscount: {$sum: '$paymentsPlan.discount'}, sumPrice: {$sum: '$paymentsPlan.price'}, allPrice: '$paymentsPlan.price', allProductName: '$paymentsPlan.productInfo.productName', allBeneficiaryName: '$paymentsPlan.beneficiaryInfo.beneficiaryName', status: true, paymentsPlan: true, userId: true, orderId: true, updateAt: true, createAt: true}}])
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
exports.next = next
exports.active = active
exports.getOrderOrganization = getOrderOrganization
