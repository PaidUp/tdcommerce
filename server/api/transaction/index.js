'use strict';

var express = require('express');
var controller = require('./transaction.controller.js');

var router = express.Router();

router.get('/list', controller.listTransactions);

module.exports = router;
