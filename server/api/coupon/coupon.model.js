'use strict';

const mongoose = require('mongoose');
var config = require('../../config/environment/index.js');

//TODO order machine with structure.
var couponObject = {
	code: {type:String, unique:true, required: true},
	startDate: {
		type:Date,
		validate: {
      validator: function(dateValue) {
        return dateValue < this.endDate;
      },
      message: '{VALUE} is not a valid started date!'
    }
  },
	endDate: {
		type:Date,
		validate: {
      validator: function(dateValue) {
        return dateValue > this.startDate;
      },
      message: '{VALUE} is not a valid ended date!'
    }
  },
	percent: Number,
	quantity: {type: Number, min:1, required: true, validate:
		{
			validator: function(qtyValue){
				console.log('qtyValue', qtyValue)
				return qtyValue > 0
			},
			message: '{VALUE} is not a valid quantity!'
		}
	},
	productsId: [String]
}

let couponSchema =  new mongoose.Schema(couponObject)

let couponModel = mongoose.model('Coupon', couponSchema, 'coupons');

couponModel.schema.path('quantity').validate(function(value){
		return value > 0
	},
  'Quantity `{VALUE}` not valid', 'Invalid quantity');

couponSchema.set('toObject', { virtuals:true})
couponSchema.set('toJSON', { virtuals:true})

module.exports = couponObject
module.exports.couponSchema = couponSchema
module.exports.couponModel = couponModel;