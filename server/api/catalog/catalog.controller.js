'use strict';

var _ = require('lodash');
var catalogService = require('./catalog.service.js');

exports.categoryProducts = function(req, res) {
  catalogService.catalogList(req.params.categoryId, function(err, dataService){
    if(err) return handleError(res, err);
    res.status(200).json(dataService);
  });
};

exports.categoryProductsV2 = function(req, res) {
  if(!req.params && !req.params.categoryId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Category Id is required"
    });
  }

  catalogService.listGroupedProductsByCategories({categoryId:req.params.categoryId}, null, true, [3], function(err, dataService){
    if(err) return handleError(res, err);
    res.status(200).json(dataService);
  });
}

exports.productView = function(req, res) {
  if(!req.params && !req.params.productId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Product Id is required"
    });
  }
  catalogService.catalogProductInfo(req.params.productId, function(err, dataService){
    if(err) return handleError(res, err);
    res.status(200).json(dataService);
  });
}
/*
exports.create:
type:'grouped',//
set:'9',// should be 9 for Team attibute set.
sku:'uniqueIDSKU',
data: {
  name:'name team9',
  websites:['1'],//fire
  shortDescription:'short_description',
  description:'description',
  status:'1',//fire
  price:'150',
  taxClass_id:'0',//fire
  urlKey:'product-url-key',
  urlPath:'url_path',
  visibility:'4',//fire
  categories:['3'],//fire
  categoryIds:['3'],//fire
  balancedCustomer_id:'balanced_customer_id1',
  tdPaymentId:'t_d_customer_id1'
}
 */

exports.productLinkView = function(req, res) {
  if(!req.params && !req.params.productId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Product Id is required"
    });
  }
  catalogService.catalogProductLink(req.params.productId, function(err, dataService){
    if(err) return handleError(res, err);
    res.status(200).json(dataService);
  });
};

exports.create = function(req, res) {
  if(!req.body && !req.body.type) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "type is required"
    });
  }
  if(!req.body.set) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "set is required"
    });
  }
  if(!req.body.sku) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "sku is required"
    });
  }
  if(!req.body.data && !req.body.data.name) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Product name is required"
    });
  }
  if(!req.body.data.tdPaymentId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Product tdPaymentId is required"
    });
  }
  catalogService.create(req.body, function(err, productId){
    if(err) return handleError(res, err);
    res.status(200).json(productId);
  });
}

exports.productView = function(req, res) {
  if(!req.params && !req.params.productId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Product Id is required"
    });
  }
  catalogService.catalogProductInfo(req.params.productId, function(err, dataService){
    if(err) return handleError(res, err);
    res.status(200).json(dataService);
  });
}

exports.productView = function(req, res) {
  if(!req.params && !req.params.productId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Product Id is required"
    });
  }
  catalogService.catalogProductInfo(req.params.productId, function(err, dataService){
    if(err) return handleError(res, err);
    res.status(200).json(dataService);
  });
}


function handleError(res, err) {
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
