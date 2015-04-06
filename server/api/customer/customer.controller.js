'use strict';

var commerceService = require('../commerce.service');
var config = require('../../config/environment');
var logger = require('../../config/logger');

exports.create = function (req, res) {
  commerceService.customerCreate(req.body, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, data);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
