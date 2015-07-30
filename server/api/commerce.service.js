'use strict';

var config = require('../config/environment');
var commerceAdapter = require(config.commerce.adapter);
var Q = require('q');

function orderList(filter, cb) {
  //console.log('orderList 3');
  commerceAdapter.orderList(filter, function (err, orders) {
    if (err) {
      return cb(err);
    }
    return cb(null, orders);
  });
}

function mapOrders(arr, func, cb, user){
  var currentPromise = Q();
  var promises = arr.map(function (el) {
    return currentPromise = currentPromise.then(function () {
      return func(el, user);
    });
  });
  return Q.all(promises).done(function(data){
    return cb(null, data);
  });
}

function fnAddOrders(order, user) {
  var deferred = Q.defer();
  getOrder(user, order.incrementId, function (err, magentoOrder) {
    if (err) deferred.reject(err);
    deferred.resolve(magentoOrder);
  });
  return deferred.promise;
};

function fnAddTransaccions(order, user) {
  var deferred = Q.defer();
  getOrder(user, order.incrementId, function (err, magentoOrder) {
    commerceAdapter.transactionList(order.incrementId, function (err, orderTransactions) {
      if (err) deferred.reject(err);
      deferred.resolve({transactions:orderTransactions,order:magentoOrder});
    });
  });
  return deferred.promise;
};

function orderLoad(orderId, cb) {
  commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {
    if (err) return cb(err);
    return cb(null, magentoOrder);
  });
}

function transactionList(orderId, cb) {
  commerceAdapter.transactionList(orderId, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    return cb(null,magentoOrders);
    //mapOrders(magentoOrders, fnAddTransaccions, cb, user);
  });
}

function orderUpdateStatus(orderId, status, cb) {
  if(status == "hold") {
    commerceAdapter.orderHold(orderId, function (err, data) {
      if (err) return cb(err);
      return cb(null, data);
    });
  }else if(status == "cancel"){
    commerceAdapter.orderCancel(orderId, function (err, data) {
      if (err) return cb(err);
      return cb(null, data);
    });
  }
  else {
    return cb({name: "StatusNotImplemented"});
  }
}

function orderCommentCreate(orderId, comment, status, cb) {
  commerceAdapter.addCommentToOrder(orderId, comment, status, function (err, data) {
    if (err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function transactionCreate(orderId, transactionId, addInfo, cb) {
  commerceAdapter.addTransactionToOrder(orderId, transactionId, addInfo, function (err, data) {
    if (err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function customerCreate(user, cb) {
  //Validate if email user exist in magento.
  if(user.meta.TDCommerceId){
    return cb(null, user.meta.TDCommerceId);
  };
  commerceAdapter.createCustomer(user, function (err, data) {
    if (err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

exports.orderUpdateStatus = orderUpdateStatus;
exports.orderList = orderList;
exports.orderLoad = orderLoad;
exports.transactionList = transactionList;
exports.orderCommentCreate = orderCommentCreate;
exports.transactionCreate = transactionCreate;
exports.customerCreate = customerCreate;
