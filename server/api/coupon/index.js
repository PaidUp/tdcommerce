'use strict';

let express = require('express');
let controller = require('./coupon.controller');

let router = express.Router();

router.post('/create', controller.create);
router.post('/list', controller.list);
router.put('/update', controller.update);

module.exports = router;