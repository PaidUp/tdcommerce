'use strict';

var express = require('express');
var controller = require('./catalog.controller.js');

var router = express.Router();

router.get('/category/list', controller.catalogList);
router.get('/product/:id', controller.catalogInfo);

module.exports = router;
