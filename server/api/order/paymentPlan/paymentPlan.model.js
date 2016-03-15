'use strict';

const mongoose = require('mongoose');

let paymentPlanObject = {
  //discount
  destinationId: {type:String, required:true},
  dateCharge: {type:Date, required:true},
  price: {type:Number, required:true},
  typeAccount: {type:String, required:true},
  account: {type:String, required:true},
  discount: {type:Number, default: 0},
  discountCode: {type:String, default: ''},
  wasProcessed: {type:Boolean, default: false},
  status: {type:String, default:'pending', enum: ['pending', 'complete', 'cancel', 'processing'], lowercase: true},
  attempts: [
    {
      status: {type:String},
      dateAttemp: {type:Date}
    }
  ],
  processingFees: {
    cardFee: {type:Number, required:true},
    cardFeeActual: {type:Number, required:true},
    cardFeeFlat: {type:Number, required:true},
    cardFeeFlatActual: {type:Number, required:true},
    achFee: {type:Number, required:true},
    achFeeActual: {type:Number, required:true},
    achFeeFlat: {type:Number, required:true},
    achFeeFlatActual: {type:Number, required:true}
  },
  collectionsFee: {
    fee: {type:Number, required:true},
    feeFlat: {type:Number, required:true}
  },
  paysFees: {
    processing: {type:Boolean, required:true},
    collections: {type:Boolean, required:true}
  },
  productInfo: {
    productId: {type:String, required:true},
    productName: {type:String, required:true}
  },
  userInfo: {
    userId: {type:String, required:true},
    userName: {type:String, required:true}
  },
  beneficiaryInfo: {
    beneficiaryId: {type:String, required:true},
    beneficiaryName: {type:String, required:true}
  }
}

let paymentPlanSchema =  new mongoose.Schema(paymentPlanObject)
paymentPlanSchema.set('toObject', { virtuals:true})
paymentPlanSchema.set('toJSON', { virtuals:true})

module.exports = paymentPlanObject// change for machine
module.exports.paymentPlanSchema = paymentPlanSchema
module.exports.paymentPlanModel = mongoose.model('paymentPlan', paymentPlanSchema, 'paymentPlan');
