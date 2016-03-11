'use strict';

let express = require('express');
let controller = require('./order.controller');

let router = express.Router();

router.post('/create', controller.create);
router.post('/list', controller.listV2);
router.put('/update', controller.update);

module.exports = router;