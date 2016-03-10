'use strict'

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var crypto = require('crypto');
//var config = require('../../config/environment/index.js');
//let due = require('machineproducts-due')

var couponSchema = {
	code: String,
	startDate: new Date(),
	endDate: new Date(),
	percent: Number,
	quantity: Number,
	ProductsId: [String]
}

var dueSchema = {//transaction
	
	destinationId: String,//destinationId
	dateCharge: Date,//purchased On (order day)
	amount: Number,//price (product)
	typeAccount: String,//paymentMethod
	account: String,//cardId
	customerId: String//Stripe customerId ??
	cardFee: String,
	cardFeeActual: String,
	cardFeeflat: String,
	cardFeeflatActual: String,
	paidUpFee: String,
	paidUpFeeFlat: String,
	wasProcessed: Boolean,
	status: String,//status
	createdDate: new Date(),
	attempts: [{// transactionInfo
		status: String,
		dateAttempt: New Date()
	}]
}

var orderSchema = {
	orderNumber: Number,//magento
  status: String,
  dues:[dueSchema],
  createdDate: new Date(),
  Address: {
		key: 'value'// ??
	},
	userInfo: {
		key: 'value'// ??
	},
	productInfo:{
		id: productId
		name: 'value'// ??
	},
	athleteInfo: {
		key: 'value'// ??	
	},
	discount: {
		key: couponSchema// ??	
	},
};

