'use strict';

var config = require('../config/environment');
var commerceAdapter = require(config.commerce.adapter);
var Q = require('q');

function orderList(filter, cb) {
  commerceAdapter.orderList(filter, function (err, orderss) {
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

function orderLoad(user, orderId, cb) {
  commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {
    if (err) return cb(err);
    return cb(null, magentoOrder);
  });
}

function transactionList(filter, cb) {
  commerceAdapter.orderList(filter, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    mapOrders(magentoOrders, fnAddTransaccions, cb, user);
  });
}

exports.orderList = orderList;
exports.orderLoad = orderLoad;
exports.transactionList = transactionList;
