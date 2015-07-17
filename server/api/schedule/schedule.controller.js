'use strict';

var scheduleService = require('./schedule.service.js');
var catalogService = require('../catalog/catalog.service.js');
var commerceService = require('../commerce.service.js');
var logger = require('../../config/logger');
var moment = require('moment');

exports.generate = function(req, res) {
    catalogService.catalogProductInfo(req.body.productId, function(err, product){
        if(err){
            handleError(res, err);
        }
      var customizeSchedule = getCustomizeSchedule(product);

        var hour = new Date().getHours();
        var minute = new Date().getMinutes();
        product.dateDeposit = product.dateDeposit.substring(0,11) + hour +":"+ minute+":00";
        var params = {
            isInFullPay: req.body.isInFullPay,
            name:product.name,
            price:req.body.price,
            intervalNumber:product.intervalNumber,
            deposit:product.deposit,
            feePrice:product.feePrice,
            feeNumber:product.feeNumber,
            dateStart:product.dateStart.substring(0,11) + hour +":"+ minute+":00",
            dateDeposit:product.dateDeposit.substring(0,11) + hour +":"+ minute+":00",
            intervalElapsed:product.intervalElapsed,
            intervalType:product.intervalType,
            dateFirstPayment:product.dateFirstPayment,
            destinationId:product.tDPaymentId,
          customizeSchedule : customizeSchedule
         };
        return res.json(200, scheduleService.generateSchedule(params));
    });
}

function getCustomizeSchedule(product){
  var customizeSchedule = null;
  if(product.customizeSchedule){
    customizeSchedule = JSON.parse(product.customizeSchedule);
  }
  return customizeSchedule;
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
          if(order.schedulePeriods){
            order.schedulePeriods.forEach(function(element, index, array){
              element.transactions = [];
              if(transactions.length > 0){
                transactions.forEach(function(elemTransaction, ind, arrayTransation){
                  if(elemTransaction.details.rawDetailsInfo.scheduleId === element.id ){
                    element.transactions.push(elemTransaction);
                  }
                });
              }
            });
          }
          return res.json(200, {scheduled:order});
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
