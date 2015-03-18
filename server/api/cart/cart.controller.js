'use strict';

var _ = require('lodash');
var cartService = require('./cart.service.js');
var logger = require('../../config/environment');
var logger = require('../../config/logger');

// Creates a new cart in the DB.
exports.create = function(req, res) {
  cartService.cartCreate(function(err, cartId){
    cartService.addFee(cartId, function(err, data) {
      res.json(200, {cartId: cartId});
    })
  });
}

exports.add = function(req, res) {
  if(!req.body && !req.body.products  && !req.body.cartId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Cart Id and products are required"
    });
  }
  cartService.cartAdd(req.body,function(err, cartAdd){
    if(err) return handleError(res, err);
    res.json(200, cartAdd);
  });
}

exports.remove = function(req, res) {
  if(!req.body && !req.body.products  && !req.body.cartId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "cartId or products is required"
    });
  }
  cartService.cartRemove(req.body,function(err, cartRemove){
    if(err) return handleError(res, err);
    res.json(200, cartRemove);
  });
}

exports.list = function(req, res) {
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartList(req.params.id,function(err, cartList){
    if(err) return handleError(res, err);
    res.json(200, cartList);
  });
}

exports.address = function(req, res) {
  cartService.cartAddress(req.body,function(err, cartAddress){
    if(err) return handleError(res, err);
    res.json(200, cartAddress);
  });
}

exports.view = function(req, res) {
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartView(req.params.id,function(err, cartView){
    if(err) return handleError(res, err);
    res.json(200, cartView);
  });
}

exports.totals = function(req, res) {
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartTotals(req.params.id,function(err, cartTotals){
    if(err) return handleError(res, err);
    res.json(200, cartTotals);
  });
}

function handleError(res, err) {
  logger.info(err, err);
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
