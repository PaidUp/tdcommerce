'use strict';

var express = require('express');
var controller = require('./catalog.controller.js');

var router = express.Router();

router.get('/category/:categoryId', controller.categoryProducts);
router.get('/product/:productId', controller.productView);
//router.get('/product/link/:productId', controller.productLinkView);
//router.post('/create', controller.create);

module.exports = router;
