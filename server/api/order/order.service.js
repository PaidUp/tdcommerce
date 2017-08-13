'use strict'

var paymentPlanModel = require('./paymentPlan/paymentPlan.model').paymentPlanModel
var orderModel = require('./order.model').orderModel
var setUserAudit = require('./order.model').setUserAudit
let mongoose = require('mongoose')

function generateInvoiceId() {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.eval('getNextSequence("invoiceIds")', function (err, result) {
      if (err) return reject(err)
      resolve('INV' + result.toUpperCase())
    })
  })
}

function createPayments(paymentsList) {
  return new Promise((resolve, reject) => {
    if (!paymentsList.length) {
      return resolve([]);
    }
    let promises = paymentsList.map(function (paymentPlan) {
      return generateInvoiceId().then((invoiceId) => {
        paymentPlan.invoiceId = invoiceId;
        return paymentPlan;
      });
    })
    Promise.all(promises)
      .then(results => {
        resolve(results.filter((paymentPlan) => {
          return paymentPlan.price && paymentPlan.dateCharge
        }))
      })
      .catch(e => {
        console.error('error:: ', e);
        reject(e)
      })

  })
}

function searchOrder(param, cb) {
  orderModel.find(
    { $text: { $search: param } },
    { score: { $meta: 'textScore' } }
  ).sort({ createAt: -1 }).exec(function (err, results) {
    if (err) {
      return cb(err)
    }
    cb(null, results)
  })
}

function getOrdersForChargeNotification(gtIsoDate, ltIsoDate, cb) {
  orderModel.find(
    { "paymentsPlan": { $elemMatch: { $and: [{ dateCharge: { $gt: new Date(gtIsoDate), $lt: new Date(ltIsoDate) } }, { status: "pending" }] } } }
  ).exec(function (err, results) {
    if (err) {
      return cb(err)
    }
    cb(null, results)
  })
}

// db.getCollection('orders').aggregate({ $match: { userId:'xxx'} },{ $limit : 5 }, {$unwind:{path: "$paymentsPlan"}},{ $sort : {"paymentsPlan.dateCharge":-1} },{ $match: {"paymentsPlan.status":'succeeded'} })
function recent(params, cb) {
  orderModel
    .aggregate([{ $match: { userId: params.userId } }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, { $unwind: { path: '$paymentsPlan' } }, { $sort: { 'paymentsPlan.dateCharge': -1 } }, { $match: { 'paymentsPlan.status': { $ne: 'pending' } } }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}
// db.getCollection('orders').aggregate({ $match: { userId:'xxx', status:'active'} },{ $limit : 1 }, {$unwind:{path: "$paymentsPlan"}},{ $sort : {"paymentsPlan.dateCharge":1} },{ $match: {"paymentsPlan.status":'pending'} })
function next(params, cb) {
  orderModel
    .aggregate([{ $match: { userId: params.userId, status: 'active' } }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, { $unwind: { path: '$paymentsPlan' } }, { $sort: { 'paymentsPlan.dateCharge': 1 } }, { $match: { 'paymentsPlan.status': 'pending' } }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}
// db.getCollection('orders').aggregate({ $match: { userId:'xxx', status:'active'} },{ $limit : 1 }, {$project:{ allProductName:'$paymentsPlan.productInfo.productName', allBeneficiaryName:'$paymentsPlan.beneficiaryInfo.beneficiaryName', status:true, paymentsPlan:true}})
function active(params, cb) {
  orderModel
    .aggregate([{ $match: { userId: params.userId, status: 'active' } }, { $limit: (typeof params.limit === 'number') ? params.limit : parseInt(params.limit, 10) }, { $project: { allProductName: '$paymentsPlan.productInfo.productName', allBeneficiaryName: '$paymentsPlan.beneficiaryInfo.beneficiaryName', status: true, paymentsPlan: true, orderId: true, description: true, userId: true } }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}

// db.getCollection('orders').aggregate({ $match: {"paymentsPlan.destinationId":'xxx'} },{ $limit : 1 }, {$project:{ sumbasePrice:{$sum: '$paymentsPlan.basePrice'}, sumoriginalPrice:{$sum: '$paymentsPlan.originalPrice'},alloriginalPrice:'$paymentsPlan.originalPrice', allbasePrice:'$paymentsPlan.basePrice', allDiscount:'$paymentsPlan.discount',sumDiscount:{$sum: '$paymentsPlan.discount'}, sumPrice:{$sum: '$paymentsPlan.price'}, allPrice:'$paymentsPlan.price', allProductName:'$paymentsPlan.productInfo.productName', allBeneficiaryName:'$paymentsPlan.beneficiaryInfo.beneficiaryName', status:true, paymentsPlan:true, userId:true, orderId:true, updateAt:true, createAt:true}})
// db.getCollection('orders').aggregate({ $match: {"paymentsPlan.destinationId":'xxx'} },{ $limit : 1 }, {$project:{ sumoriginalPrice:{$sum: '$paymentsPlan.originalPrice'}, alloriginalPrice:'$paymentsPlan.originalPrice', allDiscount:'$paymentsPlan.discount',sumDiscount:{$sum: '$paymentsPlan.discount'}, sumPrice:{$sum: '$paymentsPlan.price'}, allPrice:'$paymentsPlan.price', allProductName:'$paymentsPlan.productInfo.productName', allBeneficiaryName:'$paymentsPlan.beneficiaryInfo.beneficiaryName', status:true, paymentsPlan:true, userId:true, orderId:true, updateAt:true, createAt:true}})
function getOrderOrganization(params, cb) {
  let sort = params.sort || -1
  let limit = params.limit || 1000
  let organizationId = params.organizationId || ''
  let createAt = { $gte: new Date(params.from), $lte: new Date(params.to) }
  let match = [
    { 'paymentsPlan.destinationId': organizationId },
    { 'createAt': createAt }
  ]
  if (params.productIds && params.productIds.length > 0) {
    match.push({ 'paymentsPlan.productInfo.productId': { "$in": params.productIds } })
  }

  orderModel
    .aggregate([{
      $match: {
        $and: match
      }
    }, { $sort: { 'paymentsPlan.dateCharge': (typeof sort === 'number') ? sort : parseInt(sort, 10) } },
    //{ $limit: (typeof limit === 'number') ? limit : parseInt(limit, 10) }, 
    { $project: { sumbasePrice: { $sum: '$paymentsPlan.basePrice' }, sumoriginalPrice: { $sum: '$paymentsPlan.originalPrice' }, allbasePrice: '$paymentsPlan.basePrice', alloriginalPrice: '$paymentsPlan.originalPrice', allDiscount: '$paymentsPlan.discount', sumDiscount: { $sum: '$paymentsPlan.discount' }, sumPrice: { $sum: '$paymentsPlan.price' }, allPrice: '$paymentsPlan.price', allProductName: '$paymentsPlan.productInfo.productName', allBeneficiaryName: '$paymentsPlan.beneficiaryInfo.beneficiaryName', status: true, paymentsPlan: true, userId: true, orderId: true, updateAt: true, createAt: true, description: true } }])
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}

function transactionDetails(params, cb) {
  let cond = [
    {
      $unwind:
      {
        path: "$paymentsPlan",
        //includeArrayIndex: <string>,
        //preserveNullAndEmptyArrays: true
      }
    }
  ]
  if (params.organizationId) {
    cond.push({ $match: { "paymentsPlan.destinationId": params.organizationId } })
  }
  cond.push({
    $unwind:
    {
      path: "$paymentsPlan.attempts",
      //includeArrayIndex: <string>,
      //preserveNullAndEmptyArrays: true
    }
  });

  cond.push({ $sort: { "paymentsPlan.attempts.dateAttemp": 1 } });

  orderModel
    .aggregate(cond)
    .exec(function (err, results) {
      if (err) {
        return cb(err)
      }
      return cb(null, results)
    })
}

function cancelOrder(userSysId, orderId, cb) {
  setUserAudit(userSysId);
  orderModel.findOne({ 'orderId': orderId }, function (err, order) {
    if (err) return cb(err);
    order.status = 'canceled'
    order.paymentsPlan.forEach(function (pp, idx, arr) {
      if (pp.status === 'pending') {
        pp.status = 'canceled'
      }

    });
    order.save(function (err, updatedOrder) {
      if (err) return cb(err);
      cb(null, updatedOrder);
    });
  })
}

function activateOrder(userSysId, orderId, cb) {
  setUserAudit(userSysId);
  orderModel.findOne({ 'orderId': orderId }, function (err, order) {
    if (err) return cb(err);
    order.status = 'active'
    order.save(function (err, updatedOrder) {
      if (err) return cb(err);
      cb(null, updatedOrder);
    });
  })
}

function removePaymentPlan(userSysId, orderId, paymentPlanId, cb) {
  setUserAudit(userSysId);
  orderModel.findOne({ 'orderId': orderId }, function (err, order) {
    if (err) return cb(err);
    if (!order || !order._id) return cb('order not found')
    let ppFilter = order.paymentsPlan.filter(function (pp) {
      return pp._id.toString() !== paymentPlanId
    });
    order.paymentsPlan = ppFilter;
    order.save(function (err, updatedOrder) {
      if (err) return cb(err);
      cb(null, updatedOrder);
    });
  })
}

exports.createPayments = createPayments
exports.searchOrder = searchOrder
exports.recent = recent
exports.next = next
exports.active = active
exports.getOrderOrganization = getOrderOrganization
exports.transactionDetails = transactionDetails
exports.cancelOrder = cancelOrder;
exports.removePaymentPlan = removePaymentPlan;
exports.getOrdersForChargeNotification = getOrdersForChargeNotification;
exports.activateOrder = activateOrder;