'use strict';

var config = require('../../config/environment');
var commerceAdapter = require(config.commerce.adapter);
var Q = require('q');
var async = require('async');

function catalogList(categoryId, cb) {
  commerceAdapter.catalogList(categoryId, function (err, data) {
    if (err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function catalogProductInfo(productId, cb) {
  commerceAdapter.catalogProductInfo(productId, function (err, data) {
    if (err) return cb(err);
    commerceAdapter.catalogProductAttributeMediaList(productId, function (err, resImg) {
      if (err) return cb(err);
      data.images = resImg;
      commerceAdapter.catalogProductCustomOption(productId, function (err, resCustomOption) {
        if (err) return cb(err);
        data.customOptions = [];
        async.eachSeries(resCustomOption, function (obj, callback) {
          if(obj.type === 'drop_down'  || obj.type === 'radio'){
            commerceAdapter.catalogProductCustomOptionValue(obj.optionId, function (err, resCustomOptionValue) {
              if(!err) {
                obj.values = resCustomOptionValue;
                data.customOptions.push(obj);
                callback();
              }
            });
          }else{
            callback();
          }
        }, function (err) {
          if (err) { throw err; }
          mapCatalogProducts(resCustomOption, findCatalogProductInfo, cb, data);
        });
      });
    });
  });
}

function mapCatalogProducts(arr, func, cb, dataCatalog) {
  var currentPromise = Q();
  var promises = arr.map(function (el) {
    return currentPromise = currentPromise.then(function () {
      return func(el);
    });
  });
  return Q.all(promises).done(function (data) {
    dataCatalog.customOptions = [];
    dataCatalog.customOptions.push(data);
    return cb(null, dataCatalog);
  });
}

function findCatalogProductInfo(catalogProductInfo) {
  var deferred = Q.defer();
  if (catalogProductInfo.type === 'drop_down' || catalogProductInfo.type === 'radio') {
    commerceAdapter.catalogProductCustomOptionValue(catalogProductInfo.optionId, function (err, resCustomOptionValue) {
      if (err) deferred.reject(err);
      catalogProductInfo.values = resCustomOptionValue;
      deferred.resolve(catalogProductInfo);
    });

  } else {
    deferred.reject();
  }
  return deferred.promise;
};

exports.catalogList = catalogList;
exports.catalogProductInfo = catalogProductInfo;
