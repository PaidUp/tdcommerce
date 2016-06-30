'use strict'

const mongoose = require('mongoose');
var config = require('../../../config/environment/index.js');

let orderAuditObject = {
  _orderId: {type: String, required: true},
  userId: {type: String, required: true},
  order: {type: {}, required: true},
  createAt: {type: Date, default: Date.now}
}

let orderAuditSchema = new mongoose.Schema(orderAuditObject);
orderAuditSchema.set('toObject', { virtuals: true});
orderAuditSchema.set('toJSON', { virtuals: true});

module.exports = orderAuditObject; // change for machine
module.exports.orderAuditSchema = orderAuditSchema;
module.exports.orderAuditModel = mongoose.model('orderAudit', orderAuditSchema, config.mongo.options.prefix +'ordersAudit');
