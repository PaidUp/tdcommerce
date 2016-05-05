'use strict'

const mongoose = require('mongoose');
let Order = require('../order.model').orderSchema;
var config = require('../../../config/environment/index.js');

let orderAuditObject = {
  _orderId: {type: String, required: true},
  orders: {type: [
      {
        userId: {type: String},
        order: {type: Order},
        createAt: {type: Date, default: new Date()},
      }
  ], default: []}
}

let orderAuditSchema = new mongoose.Schema(orderAuditObject);
orderAuditSchema.set('toObject', { virtuals: true});
orderAuditSchema.set('toJSON', { virtuals: true});

module.exports = orderAuditObject; // change for machine
module.exports.orderAuditSchema = orderAuditSchema;
module.exports.orderAuditModel = mongoose.model('orderAudit', orderAuditSchema, config.mongo.options.prefix +'ordersAudit');
