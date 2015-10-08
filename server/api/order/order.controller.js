'use strict';

var _ = require('lodash');
var commerceService = require('../commerce.service.js');
var logger = require('../../config/logger');

exports.load = function(req, res) {
  if(!req.params && !req.params.orderId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }
  commerceService.orderLoad(req.params.orderId, function(err, dataService){
    if(err) return handleError(res, err);
    return res.status(200).json(dataService);
  });
}

exports.list = function(req, res) {
  commerceService.orderList(req.body, function(err, dataService){
    if(err) return handleError(res, err);
    return res.status(200).json(dataService);
  });
}

exports.commentCreate = function(req, res) {
  commerceService.orderCommentCreate(req.body.orderId, req.body.comment, req.body.status, function(err, dataService){
    if(err) return handleError(res, err);
    return res.status(200).json(dataService);
  });
}

exports.updateStatus = function(req, res) {
  if(!req.params && !req.params.orderId && !req.params.status) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }
  commerceService.orderUpdateStatus(req.params.orderId, req.params.status, function(err, dataService){
    if(err) return handleError(res, err);
    return res.status(200).json(dataService);
  });
}

exports.retryPayment = function(req, res) {
  commerceService.retryPayment(function(err, data){
    if(err) return handleError(res, err);
    return res.status(200).json(data);
  });
}

exports.complete = function(req, res) {
  commerceService.completeOrders(function(err, data){
    if(err) return handleError(res, err);
    return res.status(200).json(data);
  });
}

exports.createInvoice = function(req, res) {
  commerceService.completeOrders(function(err, data){
    if(err) return handleError(res, err);
    return res.status(200).json(data);
  });
}

exports.createOrderInvoice = function(req, res) {
  console.log('orderId' , req.params.orderId);
  if(!req.params && !req.params.orderId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Order Id is required"
    });
  }
  commerceService.createOrderInvoice(req.params.orderId, function(err, data){
    if(err) return handleError(res, err);
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
