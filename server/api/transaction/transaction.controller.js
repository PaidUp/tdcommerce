'use strict';

var commerceService = require('../commerce.service');
var config = require('../../config/environment');
var logger = require('../../config/logger');

exports.list = function (req, res) {
  commerceService.transactionList(req.params.orderId, function (err, transactions) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(transactions);
  });
}

exports.create = function (req, res) {
  commerceService.transactionCreate(req.body.orderId, req.body.transactionId, req.body.details, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(data);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
