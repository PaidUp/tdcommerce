'use strict';

var express = require('express');
var controller = require('./schedule.controller');

var router = express.Router();

router.post('/generate', controller.generate);
router.get('/payments/order/:orderId', controller.payments);

module.exports = router;
