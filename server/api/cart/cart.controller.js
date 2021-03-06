'use strict';

var _ = require('lodash');
var cartService = require('./cart.service.js');
var logger = require('../../config/logger');

// Creates a new cart in the DB.
exports.create = function(req, res) {
  cartService.cartCreate(function(err, cartId){
    res.status(200).json({cartId: cartId});
  });
}

exports.add = function(req, res) {
  if(!req.body && !req.body.products  && !req.body.cartId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id and products are required"
    });
  }
  cartService.cartAdd(req.body.cartId, req.body.products, function(err, cartAdd){
    if(err) return handleError(res, err);
    res.status(200).json(cartAdd);
  });
}

exports.remove = function(req, res) {
  if(!req.body && !req.body.products  && !req.body.cartId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "cartId or products is required"
    });
  }
  cartService.cartRemove(req.body.cartId, req.body.products,function(err, cartRemove){
    if(err) return handleError(res, err);
    res.status(200).json(cartRemove);
  });
}

exports.list = function(req, res) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartList(req.params.id,function(err, cartList){
    if(err) return handleError(res, err);
    res.status(200).json(cartList);
  });
}

exports.address = function(req, res) {
  cartService.cartAddress(req.body.cartId, req.body.shoppingCartAddressEntity,function(err, cartAddress){
    if(err) return handleError(res, err);
    res.status(200).json(cartAddress);
  });
}

exports.updatePrice = function(req, res) {
  cartService.updatePrice(req.body.cartId, req.body.productId, req.body.amount,function(err, data){
    if(err) return handleError(res, err);
    res.status(200).json(data);
  });
}

exports.customer = function(req, res) {
  cartService.updateCustomer(req.body.cartId, req.body.customer, function(err, data){
    if(err) return handleError(res, err);
    res.status(200).json(data);
  });
}

exports.shipping = function(req, res) {
  cartService.shipping(req.body.cartId, req.body.shippingMethod, function(err, data){
    if(err) return handleError(res, err);
    res.status(200).json(data);
  });
}

exports.payment = function(req, res) {
  cartService.payment(req.body.cartId, req.body.paymentData, function(err, data){
    if(err) return handleError(res, err);
    res.status(200).json(data);
  });
}

exports.place = function(req, res) {
  cartService.place(req.params.cartId, function(err, data){
    if(err) return handleError(res, err);
    res.status(200).json(data);
  });
}

exports.view = function(req, res) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartView(req.params.id,function(err, cartView){
    if(err) return handleError(res, err);
    res.status(200).json(cartView);
  });
}

exports.totals = function(req, res) {
  console.log('req.params',req.params);
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartTotals(req.params.id,function(err, cartTotals){
    console.log('cartTotals', cartTotals);
    if(err){
      console.log('err', err);
      return handleError(res, err);
    }

    res.status(200).json(cartTotals);
  });
}

exports.couponAdd = function(req, res) {
  if(!req.body && !req.body.coupon  && !req.body.cartId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id and coupon are required"
    });
  }
  cartService.cartAddCoupon(req.body.cartId, req.body.coupon, function(err, iscouponAdd){
    if(err) return handleError(res, err);
    res.status(200).json(iscouponAdd);
  });
}

function handleError(res, err) {
  logger.info(err, err);
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
