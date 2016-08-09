'use strict'

const mongoose = require('mongoose')

let paymentPlanObject = {
  // discount
  version: {type: String, required: true},
  destinationId: {type: String, required: true},
  email: {type: String, required: true},
  dateCharge: {type: Date, required: true},
  price: {type: Number, required: true},
  basePrice: {type: Number, required: true},
  originalPrice: {type: Number, required: true},
  totalFee: {type: Number, required: true},
  feePaidUp: {type: Number, required: true},
  feeStripe: {type: Number, required: true},
  paymentId: {type: String, required: true},
  typeAccount: {type: String, required: true},
  account: {type: String, required: true},
  accountBrand: {type: String, required: true},
  last4: {type: String, required: true},
  description: {type: String, required: true},
  discount: {type: Number, default: 0},
  discountCode: {type: String, default: ''},
  wasProcessed: {type: Boolean, default: false},
  status: {type: String, default: 'pending', enum: ['pending', 'complete', 'cancel', 'processing', 'succeeded', 'failed'], lowercase: true},
  attempts: {type: [
      {
        status: {type: String},
        message: {type: String},
        dateAttemp: {type: Date},
        last4: {type: String},
        accountBrand: {type: String},
        transferId: {type: String}
      }
  ], default: []},
  paymentMethods: {type: [], default: []},
  processingFees: {type: {
      cardFeeActual: {type: Number, required: true},
      cardFeeDisplay: {type: Number, required: true},
      cardFeeFlatActual: {type: Number, required: true},
      cardFeeFlatDisplay: {type: Number, required: true},
      achFeeActual: {type: Number, required: true},
      achFeeDisplay: {type: Number, required: true},
      achFeeFlatActual: {type: Number, required: true},
      achFeeFlatDisplay: {type: Number, required: true}
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
      productName: {type: String, required: true},
      productImage: {type: String, required: true},
      organizationId: {type: String, required: true},
      organizationName: {type: String, required: true},
      organizationLocation: {type: String, required: true},
      organizationImage: {type: String, required: true},
  }, required: true},
  userInfo: {type: {
      userId: {type: String, required: true},
      userName: {type: String, required: true}
  }, required: true},
  customInfo: {type: {
    formData: {},
    formTemplate: []
  }, required: true},
  createAt: {type: Date, default: Date.now},
  updateAt: {type: Date, default: Date.now}
}

let paymentPlanSchema = new mongoose.Schema(paymentPlanObject)
paymentPlanSchema.set('toObject', { virtuals: true})
paymentPlanSchema.set('toJSON', { virtuals: true})

module.exports = paymentPlanObject // change for machine
module.exports.paymentPlanSchema = paymentPlanSchema
module.exports.paymentPlanModel = mongoose.model('paymentPlan', paymentPlanSchema, 'paymentPlan')
