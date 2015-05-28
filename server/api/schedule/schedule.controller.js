'use strict';

var scheduleService = require('./schedule.service.js');
var catalogService = require('../catalog/catalog.service.js');
var commerceService = require('../commerce.service.js');
var logger = require('../../config/logger');

exports.generate = function(req, res) {
    catalogService.catalogProductInfo(req.params.productId, function(err, product){
        if(err){
            handleError(res, err);
        }
        var params = {
            name:product.name,
            price:product.price,
            basePrice:product.basePrice,
            intervalNumber:product.intervalNumber,
            deposit:product.deposit,
            feePrice:product.feePrice,
            feeNumber:product.feeNumber,
            dateStart:product.dateStart,
            dateDeposit:product.dateDeposit,
            intervalElapsed:product.intervalElapsed,
            intervalType:product.intervalType,
            dateFirstPayment:product.dateFirstPayment,
            destinationId:product.tDPaymentId
         };
        return res.json(200, scheduleService.generateSchedule(params));
    });
}

exports.payments = function(req, res) {
    if(!req.params && !req.params.orderId) {
      return res.json(400, {
        "code": "ValidationError",
        "message": "Order Id is required"
      });
    }
    console.log('req.params.orderId',req.params.orderId);
    commerceService.transactionList({order_id: req.params.orderId}, '', function(err, order){
        if(err) return handleError(res, err);
        console.log('transactionList',order);
        return res.json(200, order);
    });
}

function handleError(res, err) {
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
