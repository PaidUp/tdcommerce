'use strict';

var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.get('/load/:orderId', controller.load);
router.post('/list', controller.list);
router.post('/comment/create', controller.commentCreate);
router.get('/:orderId/status/:status', controller.updateStatus);
router.get('/retry/payments', controller.retryPayment);
router.get('/complete', controller.complete);
router.get('/:orderId/create/invoice', controller.createOrderInvoice);
router.post('/:orderId/create/creditmemo', controller.createOrderCreditMemo);

module.exports = router;
