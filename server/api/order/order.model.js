'use strict'

const mongoose = require('mongoose')
let paymentPlan = require('./paymentPlan/paymentPlan.model').paymentPlanSchema
let orderAuditModel = require('./audit/orderAudit.model').orderAuditModel
let pmx = require('pmx')

// TODO order machine with structure.
let orderObject = {
  orderId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'active',
    enum: ['pending', 'complete', 'canceled', 'processing', 'active'],
    lowercase: true
  },
  paymentsPlan: {
    type: [paymentPlan],
    default: []
  },
  userId: {
    type: String
  },
  createAt: {type: Date, default: Date.now},
  updateAt: {type: Date, default: Date.now}
}

let orderSchema = new mongoose.Schema(orderObject)

orderSchema.index({
  orderId: 'text',
  'paymentsPlan.beneficiaryInfo.beneficiaryName': 'text',
  'paymentsPlan.email': 'text',
  'paymentsPlan.productInfo.productName': 'text',
  'paymentsPlan.userInfo.userName': 'text'
}, {
  name: 'order_text_index'
})

orderSchema.set('toObject', { virtuals: true})
orderSchema.set('toJSON', { virtuals: true})

var userAudit = undefined;

function setUserAudit(userId){
  userAudit = userId;
}

orderSchema.post('save', function () {
  let orderAudit = {
    _orderId: this._id,
    userId: userAudit || this.userId,
    order: this
  }

  orderAuditModel.create(orderAudit, function (err, order) {
    if (err)
      pmx.notify(new Error('AUDIT orderSchema.post.save error: ' + JSON.stringify(err)))
  })
})

module.exports = orderObject // change for machine
module.exports.orderSchema = orderSchema
module.exports.orderModel = mongoose.model('order', orderSchema, 'orders')
module.exports.setUserAudit = setUserAudit;
