'use strict';

var express = require('express');
var controller = require('./catalog.controller.js');

var router = express.Router();

router.get('/category/:categoryId', controller.categoryProductsV2);
router.get('/product/:productId', controller.productViewV2);
//router.get('/product/link/:productId', controller.productLinkView);
//router.post('/create', controller.create);

module.exports = router;
