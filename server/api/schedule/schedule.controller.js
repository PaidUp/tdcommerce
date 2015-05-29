'use strict';

var scheduleService = require('./schedule.service.js');
var catalogService = require('../catalog/catalog.service.js');
var commerceService = require('../commerce.service.js');
var logger = require('../../config/logger');
var moment = require('moment');

exports.generate = function(req, res) {
    catalogService.catalogProductInfo(req.params.productId, function(err, product){
        if(err){
            handleError(res, err);
        }
        var hour = new Date().getHours();
        var minute = new Date().getMinutes();
        product.dateDeposit = product.dateDeposit.substring(0,11) + hour +":"+ minute+":00";
        var params = {
            name:product.name,
            price:product.price,
            basePrice:product.basePrice,
            intervalNumber:product.intervalNumber,
            deposit:product.deposit,
            feePrice:product.feePrice,
            feeNumber:product.feeNumber,
            dateStart:product.dateStart.substring(0,11) + hour +":"+ minute+":00",
            dateDeposit:product.dateDeposit.substring(0,11) + hour +":"+ minute+":00",
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
    commerceService.transactionList(req.params.orderId, function(err, transactions){
        if(err) return handleError(res, err);
        commerceService.orderLoad(req.params.orderId, function(err, order){
          if(err) return handleError(res, err);
          order.schedulePeriods.forEach(function(element, index, array){
            element.transactions = [];
            if(transactions.length > 0){
              transactions.forEach(function(elemTransaction, ind, arrayTransation){
                console.log('elemTransaction.scheduleId',elemTransaction.scheduleId);
                console.log('element.id',element.id);
                if(elemTransaction.scheduleId === element.id ){
                  element.transactions.push(elemTransaction);
                }
              });
            }
          });
          return res.json(200, {scheduled:order.schedulePeriods});
        });
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
