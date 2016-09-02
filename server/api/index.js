'use strict';

var express = require('express');

var router = express.Router();

router.use('/cart', require('./cart/index'));
router.use('/catalog', require('./catalog/index'));
router.use('/order', require('./order/index'));
router.use('/transaction', require('./transaction/index'));
router.use('/customer', require('./customer/index'));
router.use('/schedule', require('./schedule/index'));
router.use('/coupon', require('./coupon/index'));
router.use('/reports', require('./reports/index'));

module.exports = router;
