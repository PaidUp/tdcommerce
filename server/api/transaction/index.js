'use strict';

var express = require('express');
var controller = require('./transaction.controller');

var router = express.Router();

router.get('/list/order/:orderId', controller.list);
router.post('/create', controller.create);

module.exports = router;
