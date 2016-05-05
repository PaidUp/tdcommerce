'use strict'

const mongoose = require('mongoose')
let paymentPlan = require('./paymentPlan/paymentPlan.model').paymentPlanSchema

// TODO order machine with structure.
let orderObject = {
  orderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['pending', 'complete', 'cancel', 'processing', 'active'],
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
  name: 'order_text_index',
})

orderSchema.set('toObject', { virtuals: true})
orderSchema.set('toJSON', { virtuals: true})

module.exports = orderObject // change for machine
module.exports.orderSchema = orderSchema
module.exports.orderModel = mongoose.model('order', orderSchema, 'orders')
