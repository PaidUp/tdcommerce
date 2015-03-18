'use strict';

var logger = require('../../config/logger');
var commerceService = require('../commerce.service');

var fs = require('fs');
var config = require('../../config/environment');
var wkhtmltopdf = require('wkhtmltopdf');

exports.listTransactions = function (req, res) {
  var user = req.user;
  commerceService.getUsertransactions(user, function (err, transactions) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, transactions);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}

exports.generatePDF = function (req, res) {
  var html = req.html;
  wkhtmltopdf(html, { pageSize: 'letter', output: filename, footerRight:'[page]/[toPage]' }, function (code, signal) {
    return cb(code, filename);
  });
}
