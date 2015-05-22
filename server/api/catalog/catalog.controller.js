'use strict';

var _ = require('lodash');
var catalogService = require('./catalog.service.js');

exports.categoryProducts = function(req, res) {
  catalogService.catalogList(req.params.categoryId, function(err, dataService){
    if(err) return handleError(res, err);
    res.json(200, dataService);
  });
}

exports.productView = function(req, res) {
  if(!req.params && !req.params.productId) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Product Id is required"
    });
  }
  catalogService.catalogProductInfo(req.params.productId, function(err, dataService){
    if(err) return handleError(res, err);
    res.json(200, dataService);
  });
}

exports.create = function(req, res) {
  if(!req.body && !req.body.teamName) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Product name is required"
    });
  }
  catalogService.create(req.body, function(err, productId){
    if(err) return handleError(res, err);
    res.json(200, productId);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
