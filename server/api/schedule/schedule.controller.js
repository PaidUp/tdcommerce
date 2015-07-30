'use strict';

var scheduleService = require('./schedule.service.js');
var catalogService = require('../catalog/catalog.service.js');
var commerceService = require('../commerce.service.js');
var logger = require('../../config/logger');
var moment = require('moment');

exports.generate = function(req, res) {
  //console.log('--------------------');
  //console.log('req.body',req.body);
  //console.log('--------------------');
    catalogService.catalogProductInfo(req.body.productId, function(err, product){
      //console.log('----------');
      //console.log('product',product);
      //console.log('----------');
        if(err){
            handleError(res, err);
        }
      var customizeSchedule = getCustomizeSchedule(product);
      var onePaymentSchedule =  getOnePaymentSchedule(product);
      if(onePaymentSchedule){
        onePaymentSchedule.price = req.body.price;
      }
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
          customizeSchedule : customizeSchedule,
          onePaymentSchedule : onePaymentSchedule
        };
        //console.log('----------');
        //console.log('params generate',params);
        //console.log('----------');
        return res.json(200, scheduleService.generateSchedule(params));
    });
}

function getCustomizeSchedule(product){
  //console.log('----------');
  //console.log('getCustomizeSchedule product.customizeSchedule',product.customizeSchedule);
  //console.log('----------');
  var customizeSchedule = null;
  if(product.customizeSchedule){
    try{
      customizeSchedule = JSON.parse(product.customizeSchedule);
    }catch(err){
      return {error : err};
    }
  }
  //console.log('----------');
  //console.log('getCustomizeSchedule customizeSchedule',customizeSchedule);
  //console.log('----------');
  return customizeSchedule;
}

function getOnePaymentSchedule(product){
  var onePaymentSchedule = null;
  if(product.onePaymentSchedule){
    try{
      onePaymentSchedule = JSON.parse(product.onePaymentSchedule);
    }catch(err){
      return {error : err};
    }
  }
  return onePaymentSchedule;
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
