'use strict';
var config = require('../../config/environment');
var commerceAdapter = require(config.commerce.adapter);

function cartCreate(cb) {
  commerceAdapter.cartCreate(function(err, cartId) {
    if(err) {return cb(err);}
    commerceAdapter.cartAddress(cartId, config.commerce.defaultAddress,function(err, dataAdress) {
    	if(err) {return cb(err);}
  	});
    return cb(null, cartId);
  });
}

function cartList(cartId,cb) {
  commerceAdapter.cartList(cartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartAdd(shoppingCartProductEntity,cb) {
  commerceAdapter.cartAdd(shoppingCartProductEntity,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartRemove(shoppingCartProductEntity,cb) {
  commerceAdapter.cartRemove(shoppingCartProductEntity,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartAddress(shoppingCartAddressEntity,cb) {
  commerceAdapter.cartAddress(shoppingCartAddressEntity,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartView(shoppingCartId,cb) {
  commerceAdapter.cartView(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartTotals(shoppingCartId,cb) {
  commerceAdapter.cartTotals(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function prepareMerchantProducts(shoppingCart, cb) {
  var products = [];

  // TODO
  // check on every product if it has a different BPMerchant

  var product = shoppingCart.items[1];
  commerceAdapter.catalogProductInfo(product.productId, function(err, data){
    products.push({
      productId : data.productId,
      productSku: data.sku,
      productPurchaseSku: product.sku,
      BPCustomerId: data.balancedCustomerId
    });
    return cb(null, products);
  });
}

exports.addLoanInterest = function(cartId, amount, cb){
  var shoppingCartProductEntityArray = {
    cartId : cartId,
    products : [{
      product_id: config.commerce.products.interest.id,
      sku: config.commerce.products.interest.sku,
      qty: 1
    }]
  };
  commerceAdapter.cartAdd(shoppingCartProductEntityArray, function(err, data) {
    if(err) return cb(err);
    commerceAdapter.updateCartProductPrice(cartId, config.commerce.products.interest.id, amount, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    })
  });
}

exports.addFee = function(cartId, cb){
  var shoppingCartProductEntityArray = {
    cartId : cartId,
    products : [{
      product_id: config.commerce.products.fee.id,
      sku: config.commerce.products.fee.sku,
      qty: 1
    }]
  };
  commerceAdapter.cartAdd(shoppingCartProductEntityArray, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}


exports.cartCreate = cartCreate;
exports.cartList = cartList;
exports.cartAdd = cartAdd;
exports.cartRemove = cartRemove;
exports.cartAddress = cartAddress;
exports.cartView = cartView;
exports.cartTotals = cartTotals;
exports.prepareMerchantProducts = prepareMerchantProducts;
