'use strict';

var express = require('express');
var controller = require('./cart.controller.js');

var router = express.Router();

router.get('/create', controller.create);
router.post('/add', controller.add);
router.post('/remove', controller.remove);
router.get('/list/:id', controller.list);
router.post('/address', controller.address);
router.post('/update/price', controller.updatePrice);
router.post('/customer', controller.customer);
router.post('/shipping', controller.shipping);
router.post('/payment', controller.payment);
router.get('/place/:cartId', controller.place);
router.get('/view/:id', controller.view);
router.get('/totals/:id', controller.totals);
router.post('/coupon/add', controller.couponAdd);

module.exports = router;
