'use strict';

let express = require('express');
let controller = require('./coupon.controller');
let authServer = require('../auth/auth.service');

let router = express.Router();

router.post('/create', authServer.isAuthenticated(), controller.create);
router.post('/list', authServer.isAuthenticated(), controller.list);
router.put('/update', authServer.isAuthenticated(), controller.update);
router.post('/redeem', authServer.isAuthenticated(), controller.redeem);

module.exports = router;