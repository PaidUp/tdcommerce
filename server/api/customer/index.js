'use strict';

var express = require('express');
var controller = require('./customer.controller');

var router = express.Router();

router.post('/create', controller.create);

module.exports = router;
