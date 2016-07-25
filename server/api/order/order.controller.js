'use strict'

var _ = require ('lodash')
var commerceService = require ('../commerce.service.js')
var logger = require ('../../config/logger')
let orderModel = require ('./order.model').orderModel
let orderAuditModel = require ('./audit/orderAudit.model').orderAuditModel
let orderService = require ('./order.service')
let mongoose = require ('mongoose')
let ObjectId = require ('mongoose').Types.ObjectId
var pmx = require ('pmx')

exports.create = function (req, res) {
  if (req.body.paymentsPlan && req.body.paymentsPlan.length > 0) {
    req.body.paymentsPlan = orderService.createPayments (req.body.paymentsPlan)
  }
  /* run in mongdb the first time
   db.system.js.save({
   _id: 'getNextSequence',
   value: function (name) {
   var defaultSeq = '10000'
   var cursor = db.counters.findOne({ _id: name }) || { seq: defaultSeq }
   db.counters.update(
   { _id: name },
   { $set: { seq: ((parseInt(cursor.seq, 36) + 1).toString(36)).replace(/0/g, '0') } },
   { upsert: true }
   )
   return cursor.seq
   }
   })
   ---
   db.orders.createIndex( {
   orderId:"text",
   "paymentsPlan.beneficiaryInfo.beneficiaryName": "text",
   "paymentsPlan.email": "text" ,
   "paymentsPlan.productInfo.productName": "text" ,
   "paymentsPlan.userInfo.userName": "text"  } ,{name: "orders_text_index"})
   */
  mongoose.connection.db.eval ('getNextSequence("orderIds")', function (err, result) {
    req.body.orderId = result.toUpperCase ()
    orderModel.create (req.body, function (err, order) {
      if (err) return res.status (400).json ({err: err})
      return res.status (200).json ({
        _id: order._id,
        status: order.status,
        orderId: order.orderId,
        paymentsPlan: order.paymentsPlan
      })
    })
  })
}

exports.listV2 = function (req, res) {
  // http://mongoosejs.com/docs/api.html#query_Query-lean
  let filter = {}
  if (req.body.orderId) {
    filter._id = new ObjectId (req.body.orderId)
  }
  if (req.body.userId) {
    filter.userId = req.body.userId
  }
  let limit = req.body.limit || 100
  let sort = req.body.sort || -1

  orderModel.find (filter).limit (limit).sort ({createAt: sort}).lean ().exec (function (err, orders) {
    if (err) return res.status (400).json ({err: err})
    let newOrders = orders.map (function (order) {
      order.totalPrice = order.paymentsPlan.reduce (function (prev, current) {
        return prev + current.price
      }, 0)
      return order
    })
    return res.status (200).json ({orders: newOrders})
  })
}

exports.listCronjob = function (req, res) {
  let filter = {
    'paymentsPlan': {
      '$elemMatch': {
        'status': 'pending',
        'wasProcessed': false,
        'dateCharge': {'$lte': new Date ()}
      }
    }, 'status': 'active'
  }
  orderModel.find (filter, 'paymentsPlan.$ userId orderId status', function (err, orders) {
    if (err) return res.status (400).json ({err: err})
    return res.status (200).json ({orders: orders})
  })
}

exports.update = function (req, res) {
  orderModel.findOneAndUpdate (req.body.filter, {'$set': req.body.data}, function (err, orders) {
    if (err) return res.status (400).json ({err: err})
    return res.status (200).json ({orders: orders})
  })
}

exports.addPayments = function (req, res) {
  req.body.paymentsPlan = orderService.createPayments (req.body.paymentsPlan)
  orderModel.findOneAndUpdate ({_id: req.body.orderId}, {'$push': {paymentsPlan: {$each: req.body.paymentsPlan}}}, {new: true}, function (err, order) {
    if (err) return res.status (400).json ({err: err})

    createOrderAudit ({
      _orderId: order._id,
      userId: req.body.userSysId,
      order: order
    })

    return res.status (200).json (order)
  })
}

exports.updatePayments = function (req, res) {
  if(!req.body.userSysId){
    return res.status (400).json ({err: "param userSysId is required"})
  }

  let filter = {
    paymentsPlan: {$elemMatch: {_id: req.body.paymentPlanId}}
  }

  orderModel.findOneAndUpdate (filter, {
      '$set': {
        'paymentsPlan.$.destinationId': req.body.paymentPlan.destinationId,
        'paymentsPlan.$.description': req.body.paymentPlan.description,
        'paymentsPlan.$.dateCharge': req.body.paymentPlan.dateCharge,
        'paymentsPlan.$.price': req.body.paymentPlan.price,
        'paymentsPlan.$.basePrice': req.body.paymentPlan.basePrice,
        'paymentsPlan.$.originalPrice': req.body.paymentPlan.originalPrice,
        'paymentsPlan.$.typeAccount': req.body.paymentPlan.typeAccount,
        'paymentsPlan.$.account': req.body.paymentPlan.account,
        'paymentsPlan.$.last4': req.body.paymentPlan.last4,
        'paymentsPlan.$.accountBrand': req.body.paymentPlan.accountBrand,
        'paymentsPlan.$.discount': req.body.paymentPlan.discount,
        'paymentsPlan.$.discountCode': req.body.paymentPlan.discountCode,
        'paymentsPlan.$.wasProcessed': req.body.paymentPlan.wasProcessed,
        'paymentsPlan.$.status': req.body.paymentPlan.status,
        'paymentsPlan.$.attempts': req.body.paymentPlan.attempts,
        'paymentsPlan.$.totalFee': req.body.paymentPlan.totalFee,
        'paymentsPlan.$.feeStripe': req.body.paymentPlan.feeStripe,
        'paymentsPlan.$.feePaidUp': req.body.paymentPlan.feePaidUp,
        'paymentsPlan.$.updateAt': new Date ()
      }
    },
    {new: true}
    , function (err, order) {
      if (err) return res.status (400).json ({err: err})

      createOrderAudit ({
        _orderId: order._id,
        userId: req.body.userSysId,
        order: order
      })

      return res.status (200).json (order)
    })
}

exports.updateAllPayments = function (req, res) {
  if(!req.body.userSysId){
    return res.status (400).json ({err: "param userSysId is required"})
  }
  if(!req.body._id){
    return res.status (400).json ({err: "param _id order is required"})
  }
  if(!req.body.paymentsPlan){
    return res.status (400).json ({err: "param paymentsPlan is required"})
  }

  let pps = {};
  try{
    pps = JSON.parse(req.body.paymentsPlan).pps
  }catch(e){
    return res.status (500).json ({err: e})
  }

  let filter = {
  _id: req.body.orderId
  }

  orderModel.findOneAndUpdate (filter, {
      '$set': {
        'paymentsPlan': pps
      }
    },
    {new: false}
    , function (err, order) {
      if (err) return res.status (400).json ({err: err})

      createOrderAudit ({
        _orderId: order._id,
        userId: req.body.userSysId,
        order: order
      })

      return res.status (200).json (order)
    })
}

function createOrderAudit (orderAudit) {
  console.log ('ORDERAUDIT', orderAudit)
  orderAuditModel.create (orderAudit, function (err, order) {
    if (err)
      pmx.notify (new Error ('AUDIT order error: ' + JSON.stringify (err)))
    console.log ('ORDERAUDIT err', err)
    console.log ('ORDERAUDIT ff', order)
  })
}

exports.completev3 = function (req, res) {
  orderModel.update ({
    status: 'active', $where: function () {
      return this.paymentsPlan.every (function (sObj) {
        return sObj.status === 'succeeded'
      })
    }
  }, {$set: {'status': 'complete'}}, {multi: true}, function (err, data) {
    if (err) return handleError (res, err)
    return res.status (200).json (data)
  })
}

exports.load = function (req, res) {
  if (!req.params && !req.params.orderId) {
    return res.status (400).json ({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  commerceService.orderLoad (req.params.orderId, function (err, dataService) {
    if (err) return handleError (res, err)
    return res.status (200).json (dataService)
  })
}

exports.list = function (req, res) {
  commerceService.orderList (req.body, function (err, dataService) {
    if (err) return handleError (res, err)
    return res.status (200).json (dataService)
  })
}

exports.commentCreate = function (req, res) {
  commerceService.orderCommentCreate (req.body.orderId, req.body.comment, req.body.status, function (err, dataService) {
    if (err) return handleError (res, err)
    return res.status (200).json (dataService)
  })
}

exports.updateStatus = function (req, res) {
  if (!req.params && !req.params.orderId && !req.params.status) {
    return res.status (400).json ({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  commerceService.orderUpdateStatus (req.params.orderId, req.params.status, function (err, dataService) {
    if (err) return handleError (res, err)
    return res.status (200).json (dataService)
  })
}

exports.retryPayment = function (req, res) {
  commerceService.retryPayment (function (err, data) {
    if (err) return handleError (res, err)
    return res.status (200).json (data)
  })
}

exports.complete = function (req, res) {
  commerceService.completeOrders (function (err, data) {
    if (err) return handleError (res, err)
    return res.status (200).json (data)
  })
}

exports.createInvoice = function (req, res) {
  commerceService.completeOrders (function (err, data) {
    if (err) return handleError (res, err)
    return res.status (200).json (data)
  })
}

exports.createOrderInvoice = function (req, res) {
  if (!req.params && !req.params.orderId) {
    return res.status (400).json ({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  commerceService.createOrderInvoice (req.params.orderId, function (err, data) {
    if (err) return handleError (res, err)
    return res.status (200).json (data)
  })
}

exports.createOrderCreditMemo = function (req, res) {
  if (!req.params && !req.params.orderId) {
    return res.status (400).json ({
      'code': 'ValidationError',
      'message': 'Order Id is required'
    })
  }
  if (!req.body && !req.body.qty) {
    return res.status (400).json ({
      'code': 'ValidationError',
      'message': 'qty is required'
    })
  }
  if (!req.body && !req.body.value) {
    return res.status (400).json ({
      'code': 'ValidationError',
      'message': 'value is required'
    })
  }

  commerceService.createCreditMemo ({
    orderId: req.params.orderId,
    qty: req.body.qty,
    value: req.body.value
  }, function (err, data) {
    if (err) return handleError (res, err)
    return res.status (200).json (data)
  })
}

exports.createShipment = function (req, res) {
  var outputPromise = commerceService.createShipment (req.body.orderList)
    .then (function (value) {
      return res.status (200).json (value)
    })
}

exports.searchOrder = function (req, res) {
  orderService.searchOrder (req.body.params, function (err, orders) {
    if (err) {
      return res.status (400).json ({err: err})
    }
    return res.status (200).json ({orders: orders})
  })
}

exports.recent = function (req, res) {
  orderService.recent (req.params, function (err, result) {
    if (err) return res.status (400).json (err)
    return res.status (200).json (result)
  })
}

exports.next = function (req, res) {
  orderService.next (req.params, function (err, result) {
    if (err) return res.status (400).json (err)
    return res.status (200).json (result)
  })
}

exports.active = function (req, res) {
  orderService.active (req.params, function (err, result) {
    if (err) return res.status (400).json (err)
    return res.status (200).json (result)
  })
}

exports.getOrderOrganization = function (req, res) {
  orderService.getOrderOrganization (req.params, function (err, result) {
    if (err) return res.status (400).json (err)
    return res.status (200).json (result)
  })
}

exports.updateWebhook = function (req, res) {
  // console.log('req.body.object.transfer', req.body.object.transfer)
  // console.log('req.body.object.status', req.body.object.status)
  // console.log('req.body.object.metadata.orderId', req.body.object.metadata.scheduleId)
  // console.log('req.body.object.id', req.body.object.id)
  orderModel.findOne({'paymentsPlan.attempts.transferId': req.body.object.transfer, orderId: req.body.object.metadata.orderId}, function (err, order) {
  // orderModel.findOneAndUpdate({"paymentsPlan.attempts.transferId": req.body.object.transfer}, {'$set': req.body.data}, function (err, orders) {
    // console.log('err', err)
    if (err) return res.status(400).json({err: err})
    console.log('order', order)
    order.paymentsPlan = order.paymentsPlan.map(function (pp) {
      // console.log('pp', pp.id)
      // console.log('pp', pp._id)
      if(req.body.object.metadata.scheduleId === pp.id) {
        pp.status = req.body.object.status
      }
      // console.log('pp', pp)
      pp.attempts = pp.attempts.map(function (at) {
        if (at.transferId === req.body.object.transfer) {
          at.status = req.body.object.status
          at.message = req.body.object.id
          // console.log('at', at)
        }
        return at
      })
      return pp
    })
    // console.log('order1', order)
    order.save(order, function (err, orderSave) {
      // console.log('err', err)
      if (err) return res.status(400).json({err: err})
      console.log('orderSave', orderSave)
      return res.status(200).json({webhook: true})
    })
  })
}

function handleError (res, err) {
  var httpErrorCode = 500

  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  logger.log ('error', err)

  return res.status (httpErrorCode).json ({code: err.name, message: err.message, errors: err.errors})
}
