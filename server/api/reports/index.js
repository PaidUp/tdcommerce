'use strict';

var express = require('express');
var controller = require('./revenue.controller');
var authServer = require('../auth/auth.service');
var router = express.Router();

router.post('/revenue/projections',  authServer.isAuthenticated(), controller.projections);

module.exports = router;
