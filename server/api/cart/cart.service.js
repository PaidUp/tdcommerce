'use strict';
var config = require('../../config/environment');
var commerceAdapter = require(config.commerce.adapter);

exports.cartCreate = function(cb) {
  commerceAdapter.cartCreate(function(err, cartId) {
    if(err) {return cb(err);}
    return cb(null, cartId);
  });
}

exports.cartAdd = function(cartId, products, cb) {
  commerceAdapter.cartAdd(cartId, products, function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.cartList = function(cartId,cb) {
  commerceAdapter.cartList(cartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.cartAddress = function(cartId, shoppingCartAddressEntity,cb) {
  commerceAdapter.cartAddress(cartId, shoppingCartAddressEntity,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.cartRemove = function(cartId, products, cb) {
  commerceAdapter.cartRemove(cartId, products ,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.cartView = function(shoppingCartId,cb) {
  commerceAdapter.cartView(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.cartTotals = function(shoppingCartId,cb) {
  commerceAdapter.cartTotals(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.updatePrice = function(cartId, productId, amount, cb){
  commerceAdapter.updateCartProductPrice(cartId, productId, amount, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.updateCustomer = function(cartId, customer, cb){
  commerceAdapter.cartCustomer(cartId, customer, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}


exports.shipping = function(cartId, shipping, cb){
  commerceAdapter.setShipping(cartId, shipping, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.payment = function(cartId, payment, cb){
  commerceAdapter.setPayment(cartId, payment, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.place = function(cartId, cb){
  commerceAdapter.placeOrder(cartId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.cartAddCoupon = function(cartId, products, cb) {
  commerceAdapter.cartAddCoupon(cartId, products, function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}
