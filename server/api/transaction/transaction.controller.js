'use strict';

var commerceService = require('../commerce.service');
var config = require('../../config/environment');
var logger = require('../../config/logger');

exports.list = function (req, res) {
  commerceService.transactionList({order_id: req.params.orderId},req.params.userId, function (err, transactions) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, transactions);
  });
}

exports.create = function (req, res) {
  commerceService.transactionCreate(req.body.orderId, req.body.transactionId, req.body.details, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
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
