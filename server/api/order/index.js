'use strict';

var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.get('/load/:orderId', controller.load);
router.post('/list', controller.list);
router.post('/comment/create', controller.commentCreate);
router.get('/:orderId/status/:status', controller.updateStatus);

module.exports = router;
