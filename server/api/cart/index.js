'use strict';

var express = require('express');
var controller = require('./cart.controller.js');

var router = express.Router();

router.get('/create', controller.create);
router.post('/address', controller.address);
router.get('/list/:id', controller.list);
router.post('/add', controller.add);
router.get('/view/:id', controller.view);
router.get('/totals/:id', controller.totals);

module.exports = router;
