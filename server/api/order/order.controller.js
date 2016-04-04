'use strict'

var _ = require('lodash')
var commerceService = require('../commerce.service.js')
var logger = require('../../config/logger')
let orderModel = require('./order.model').orderModel
let orderService = require('./order.service')

exports.create = function (req, res) {
  if (req.body.paymentsPlan && req.body.paymentsPlan.length > 0) {
    req.body.paymentsPlan = orderService.createPayments(req.body.paymentsPlan)
  }

  orderModel.create(req.body, function (err, order) {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json({_id: order._id, status: order.status, paymentsPlan: order.paymentsPlan})
  })
}

exports.listV2 = function (req, res) {
  orderModel.find(req.body, function (err, orders) {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json({orders: orders})
  })
}

exports.listCronjob = function (req, res) {
  let filter = {'paymentsPlan': { '$elemMatch': {'status': 'pending','wasProcessed': false,'dateCharge': {'$lte': new Date()}}},'status': 'active'}
  orderModel.find(filter, 'paymentsPlan.$ userId' , function (err, orders) {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json({orders: orders})
  })
}

exports.update = function (req, res) {
  orderModel.findOneAndUpdate(req.body.filter, {'$set': req.body.data}, function (err, orders) {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json({orders: orders})
  })
}

exports.addPayments = function (req, res) {
  req.body.paymentsPlan = orderService.createPayments(req.body.paymentsPlan)
  orderModel.findOneAndUpdate({_id: req.body.orderId}, {'$push': {paymentsPlan: { $each: req.body.paymentsPlan}}}, function (err, order) {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json(order)
  })
}

exports.updatePayments = function (req, res) {
  let filter = {_id: req.body.orderId, 'paymentsPlan._id': req.body.paymentPlanId, 'paymentsPlan.status': 'pending'}
  orderModel.findOneAndUpdate(filter, {'$set': {
      'paymentsPlan.$.destinationId': req.body.paymentPlan.destinationId,
      'paymentsPlan.$.dateCharge': req.body.paymentPlan.dateCharge,
      'paymentsPlan.$.price': req.body.paymentPlan.price,
      'paymentsPlan.$.typeAccount': req.body.paymentPlan.typeAccount,
      'paymentsPlan.$.account': req.body.paymentPlan.account,
      'paymentsPlan.$.accountBrand': req.body.paymentPlan.accountBrand,
      'paymentsPlan.$.discount': req.body.paymentPlan.discount,
      'paymentsPlan.$.discountCode': req.body.paymentPlan.discountCode,
      'paymentsPlan.$.wasProcessed': req.body.paymentPlan.wasProcessed,
      'paymentsPlan.$.status': req.body.paymentPlan.status,
      'paymentsPlan.$.attempts': req.body.paymentPlan.attempts,
      'paymentsPlan.$.updateAt': new Date()
  }}, function (err, order) {
    if (err) return res.status(400).json({err: err})
    return res.status(200).json(order)
  })
}

exports.completev3 = function (req, res) {
  orderModel.update({status: 'active', $where: function () { return this.paymentsPlan.every(function (sObj) { return sObj.status === 'succeeded' }) }}, {$set: {'status': 'complete'}}, {multi: true}, function (err, data) {
    if (err) return handleError(res, err)
    return res.status(200).json(data)
  })
}

exports.load = function (req, res) {
  if (!req.params && !req.params.orderId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  commerceService.orderLoad(req.params.orderId, function (err, dataService) {
    if (err) return handleError(res, err)
    return res.status(200).json(dataService)
  })
}

exports.list = function (req, res) {
  commerceService.orderList(req.body, function (err, dataService) {
    if (err) return handleError(res, err)
    return res.status(200).json(dataService)
  })
}

exports.commentCreate = function (req, res) {
  commerceService.orderCommentCreate(req.body.orderId, req.body.comment, req.body.status, function (err, dataService) {
    if (err) return handleError(res, err)
    return res.status(200).json(dataService)
  })
}

exports.updateStatus = function (req, res) {
  if (!req.params && !req.params.orderId && !req.params.status) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  commerceService.orderUpdateStatus(req.params.orderId, req.params.status, function (err, dataService) {
    if (err) return handleError(res, err)
    return res.status(200).json(dataService)
  })
}

exports.retryPayment = function (req, res) {
  commerceService.retryPayment(function (err, data) {
    if (err) return handleError(res, err)
    return res.status(200).json(data)
  })
}

exports.complete = function (req, res) {
  commerceService.completeOrders(function (err, data) {
    if (err) return handleError(res, err)
    return res.status(200).json(data)
  })
}

exports.createInvoice = function (req, res) {
  commerceService.completeOrders(function (err, data) {
    if (err) return handleError(res, err)
    return res.status(200).json(data)
  })
}

exports.createOrderInvoice = function (req, res) {
  if (!req.params && !req.params.orderId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  commerceService.createOrderInvoice(req.params.orderId, function (err, data) {
    if (err) return handleError(res, err)
    return res.status(200).json(data)
  })
}

exports.createOrderCreditMemo = function (req, res) {
  if (!req.params && !req.params.orderId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  if (!req.body && !req.body.qty) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'qty is required'
    })
  }
  if (!req.body && !req.body.value) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'value is required'
    })
  }

  commerceService.createCreditMemo({
    orderId: req.params.orderId,
    qty: req.body.qty,
    value: req.body.value
  }, function (err, data) {
    if (err) return handleError(res, err)
    return res.status(200).json(data)
  })
}

exports.createShipment = function (req, res) {
  var outputPromise = commerceService.createShipment(req.body.orderList)
    .then(function (value) {
      return res.status(200).json(value)
    })
}

function handleError (res, err) {
  var httpErrorCode = 500

  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  logger.log('error', err)

  return res.status(httpErrorCode).json({code: err.name, message: err.message, errors: err.errors})
}
