'use strict';

var scheduleService = require('./schedule.service.js');
var catalogService = require('../catalog/catalog.service.js');
var logger = require('../../config/logger');

exports.generate = function(req, res) {
    var productId = req.params.productId;
    catalogService.catalogProductInfo(productId, function(err, product){
        if(err){
            handleError(res, err);
            //return res.json(400, {description:"product not exist" + err});
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
    return res.json(200, {});
}

function handleError(res, err) {
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
