'use strict'

var config = require('../../config/environment');
var MagentoAPI = require('magento');
var magento = new MagentoAPI(config.commerce.magento);
var camelize = require('camelize');
// const snakeize = require('snakeize');
// const logger = require('../../config/logger.js');

var login = exports.login = function(cb) {
  magento.core.info(function(err, data) {
    if(err) {
      magento.login(function(err, sessId) {
        if(err) return cb(err);
        return cb(null, sessId);
      });
    }
    else {
      return cb(null, true);
    }
  });
}

exports.paymentPlanCreate = function(param, res){
  login(function(err) {
    if (err) {
      return res(err);
    }
    magento.bighippoPaymentplan.create({
      paymentPlanData: param
    }, function (err, resPaymentPLan) {
      if(err) return res(err);
      return res(null,camelize(resPaymentPLan));
    });
  });
}

exports.paymentPlanUpdate = function(param, res){
  login(function(err) {
    if (err) {
      return res(err);
    }
    // param = {paymentPlanId:resulst.paymentplanId, playmentPlanData: {name:'testName3', destination:'destinationTest3'}};
    magento.bighippoPaymentplan.update(param, function (err, resPaymentPLan) {
      if(err) return res(err);
      return res(null,camelize(resPaymentPLan));
    });
  });
}


exports.paymentPlanInfo = function(param, res){
  login(function(err) {
    if (err) {
      return res(err);
    }
    magento.bighippoPaymentplan.info(param, function (err, resPaymentPLan) {
      if(err) return res(err);
      return res(null,camelize(resPaymentPLan));
    });
  });
}


exports.paymentPlanList = function(param, res){
  login(function(err) {
    if (err) {
      return res(err);
    }
    magento.bighippoPaymentplan.list(param, function (err, resPaymentPLan) {
      if(err) return res(err);
      return res(null,camelize(resPaymentPLan));
    });
  });
}

exports.paymentPlanDelete = function(param, res){
  login(function(err) {
    if (err) {
      return res(err);
    }
    magento.bighippoPaymentplan.delete(param, function (err, resPaymentPLan) {
      if(err) return res(err);
      return res(null,camelize(resPaymentPLan));
    });
  });
}

