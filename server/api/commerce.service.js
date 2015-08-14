'use strict';

var config = require('../config/environment');
var logger = require('../config/logger');
var commerceAdapter = require(config.commerce.adapter);
var Q = require('q');
var async = require('async');
var moment = require('moment');

function orderList(filter, cb) {
  //console.log('orderList 3');
  commerceAdapter.orderList(filter, function (err, orders) {
    if (err) {
      return cb(err);
    }
    return cb(null, orders);
  });
}

function orderListPromise(filter) {
  var deferred = Q.defer();
  commerceAdapter.orderList(filter, function (err, orders) {
    if (err) {
      deferred.reject(err);
    }else{
      deferred.resolve(orders);
    }
  });
  return deferred.promise;
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
};

function loadOrders(orders){
  var deferred = Q.defer();
  var orderList = [];
  async.eachSeries(orders,
    function(order, callback){
      orderLoad(order.incrementId, function(err, data){
        if(err){
          callback(err);
        }else{
          transactionList(order.incrementId, function(err1, data1){
            if(err){
              callback(err1)
            }else{
              data.transactions = data1;
              orderList.push(data);
              callback();
            }
          })
        }
      });
    },
    function(err){
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve(orderList);
      }
    });
  return deferred.promise;
};

function getListToRetryPayment(ordersLoad){
  var deferred = Q.defer();
  var now = moment();
  var ordersList = [];
  async.eachSeries(ordersLoad,
    function(orderLoad, callback){
      try{
        var retryCandidateList = [];
        orderLoad.retry.forEach(function(ele, idx, arr){
          var candidate = true;
          orderLoad.transactions.forEach(function(ele2, idx2, arr2){
              if(ele.retryId === ele2.details.rawDetailsInfo.retryId){
                candidate = false;
                return;
              }
            }
          );
          if(candidate){
            if(now.isAfter(ele.date, 'second')){
              retryCandidateList.push(ele);
            }
          }
        });
        if(retryCandidateList.length > 0){
          orderLoad.retrySchedules = retryCandidateList;
          ordersList.push(orderLoad);
        }
      }catch (err){
        logger.error(err);
      }finally{
        callback();
      }
    },
    function(err){
      if(err){
        deferred.reject(err);
      }else{
        deferred.resolve(ordersList);
      }
    });
  return deferred.promise;
};

function retryPayment(cb){
  orderListPromise({status: ["pending","processing"]})
    .then(function(orders){
      return loadOrders(orders);
    }).then(function (ordersLoad){
      return getListToRetryPayment(ordersLoad);
    }).done(function(data){
      cb(null, data);
    });
};

function getOrdersToComplete(ordersLoad){
  var deferred = Q.defer();
  var ordersList = [];

  ordersLoad.forEach(function(ele , indx, arr){
    var obj = {};
    var schedulePeriods = ele.schedulePeriods;
    var transactions = ele.transactions;

    schedulePeriods.forEach(function(period, idxPeriod, arrPeriod){
      transactions.forEach(function(transaction, idxTrans, arrTrans){
        if(transaction.details.rawDetailsInfo.scheduleId == period.id &&
          transaction.details.rawDetailsInfo.status == 'succeeded'){
            obj[period.id] = true;
          return;
        }
      });
    });

    if(schedulePeriods.length === Object.keys(obj).length){
      ordersList.push(ele);
    };
    if(arr.length == (indx+1)){
      deferred.resolve(ordersList);
    };
  });
  return deferred.promise;
};

function completeOrders(cb){
  orderListPromise({status: ["pending","processing"]})
    .then(function(orders){
      return loadOrders(orders);
    }).then(function (ordersLoad){

      return getOrdersToComplete(ordersLoad);
    }).done(function(data){
      console.log('ordersLoad',data);
      cb(null, data);
    });
};

function createInvoice(orderId, qty){
  commerceAdapter.createOrderInvoice(orderId,qty).then(function(){
    
  });
}

exports.orderUpdateStatus = orderUpdateStatus;
exports.orderList = orderList;
exports.orderLoad = orderLoad;
exports.transactionList = transactionList;
exports.orderCommentCreate = orderCommentCreate;
exports.transactionCreate = transactionCreate;
exports.customerCreate = customerCreate;
exports.retryPayment = retryPayment;
exports.completeOrders = completeOrders;

