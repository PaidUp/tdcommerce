'use strict'

const mongoose = require('mongoose')

let paymentPlanObject = {
  // discount
  destinationId: {type: String, required: true},
  email: {type: String, required: true},
  dateCharge: {type: Date, required: true},
  price: {type: Number, required: true},
  originalPrice: {type: Number, required: true},
  totalFee: {type: Number, required: true},
  paymentId: {type: String, required: true},
  typeAccount: {type: String, required: true},
  account: {type: String, required: true},
  last4: {type: String, required: true},
  description: {type: String, required: true},
  discount: {type: Number, default: 0},
  discountCode: {type: String, default: ''},
  wasProcessed: {type: Boolean, default: false},
  status: {type: String, default: 'pending', enum: ['pending', 'complete', 'cancel', 'processing', 'succeeded', 'failed'], lowercase: true},
  attempts: {type: [
      {
        status: {type: String},
        dateAttemp: {type: Date}
      }
  ], default: []},
  processingFees: {type: {
      cardFee: {type: Number, required: true},
      cardFeeActual: {type: Number, required: true},
      cardFeeFlat: {type: Number, required: true},
      cardFeeFlatActual: {type: Number, required: true},
      achFee: {type: Number, required: true},
      achFeeActual: {type: Number, required: true},
      achFeeFlat: {type: Number, required: true},
      achFeeFlatActual: {type: Number, required: true}
  }, required: true},
  collectionsFee: {type: {
      fee: {type: Number, required: true},
      feeFlat: {type: Number, required: true}
  }, required: true},
  paysFees: {type: {
      processing: {type: Boolean, required: true},
      collections: {type: Boolean, required: true}
  }, required: true},
  productInfo: {type: {
      productId: {type: String, required: true},
      productName: {type: String, required: true}
  }, required: true},
  userInfo: {type: {
      userId: {type: String, required: true},
      userName: {type: String, required: true}
  }, required: true},
  beneficiaryInfo: {type: {
      beneficiaryId: {type: String, required: true},
      beneficiaryName: {type: String, required: true}
  }, required: true},
  createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()}
}

let paymentPlanSchema = new mongoose.Schema(paymentPlanObject)
paymentPlanSchema.set('toObject', { virtuals: true})
paymentPlanSchema.set('toJSON', { virtuals: true})

module.exports = paymentPlanObject // change for machine
module.exports.paymentPlanSchema = paymentPlanSchema
module.exports.paymentPlanModel = mongoose.model('paymentPlan', paymentPlanSchema, 'paymentPlan')
