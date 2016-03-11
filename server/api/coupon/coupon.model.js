'use strict';

const mongoose = require('mongoose');
var config = require('../../config/environment/index.js');

//TODO order machine with structure.
var couponObject = {
	code: {type:String, unique:true},
	startDate: Date,
	endDate: Date,
	percent: Number,
	quantity: Number,
	productsId: [String]
}

let couponSchema =  new mongoose.Schema(couponObject)
couponSchema.set('toObject', { virtuals:true})
couponSchema.set('toJSON', { virtuals:true})

module.exports = couponObject
module.exports.couponSchema = couponSchema
module.exports.couponModel = mongoose.model('Coupon', couponSchema, 'coupons');