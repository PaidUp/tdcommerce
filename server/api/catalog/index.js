'use strict';

var express = require('express');
var controller = require('./catalog.controller.js');

var router = express.Router();

router.get('/category/:categoryId', controller.categoryProducts);
router.get('/product/:id', controller.productView);

module.exports = router;
