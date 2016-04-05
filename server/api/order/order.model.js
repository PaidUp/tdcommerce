'use strict'

const mongoose = require('mongoose')
let paymentPlan = require('./paymentPlan/paymentPlan.model').paymentPlanSchema

// TODO order machine with structure.
let seq;
let orderObject = {
  //orderNumber: {type: String, default: seq},
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'complete', 'cancel', 'processing'],
    lowercase: true
  },
  paymentsPlan: {
    type: [paymentPlan],
    default: []
  },
  userId: {
    type: String
  },
  createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()}
}

function getNextSequence(cb){
  mongoose.connection.db.eval("getNextSequence('order_seq')", function(err, retVal) {
    console.log('ERR---', err)
    console.log('retVal', retVal)
    if(err){
      return cb(err)
    }
    seq = retVal;
    return cb(null, retVal);
  });

}



let orderSchema = new mongoose.Schema(orderObject)

/*
orderSchema.pre('save', function (next) {
  getNextSequence(function(err, data){
    if(err){
      next(new Error('something went wrong'));
    }
    next();
  });

});
*/
orderSchema.set('toObject', { virtuals: true})
orderSchema.set('toJSON', { virtuals: true})

module.exports = orderObject // change for machine
module.exports.orderSchema = orderSchema
module.exports.orderModel = mongoose.model('order', orderSchema, 'orders')
