'use strict';

var express = require('express');
var controller = require('./schedule.controller');

var router = express.Router();

router.get('/generate/product/:productId', controller.generate);
router.get('/payments/order/:orderId/status/:status', controller.payments);

module.exports = router;
