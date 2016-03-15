'use strict';

const mongoose = require('mongoose');
let paymentPlan = require('./paymentPlan/paymentPlan.model').paymentPlanSchema

//TODO order machine with structure.
let orderObject = {
  status: {
	type:String,
	default:'pending',
	enum: ['pending', 'complete'],
	lowercase: true
  },
  paymentsPlan: {
	type:[paymentPlan],
	default:[]
  }
}

let orderSchema =  new mongoose.Schema(orderObject)
orderSchema.set('toObject', { virtuals:true})
orderSchema.set('toJSON', { virtuals:true})

module.exports = orderObject// change for machine
module.exports.orderSchema = orderSchema
module.exports.orderModel = mongoose.model('order', orderSchema, 'orders')