'use strict'

let express = require('express')
let controller = require('./order.controller')
let authServer = require('../auth/auth.service')

let router = express.Router()

router.post('/search', authServer.isAuthenticated(), controller.searchOrder)
router.get('/recent', authServer.isAuthenticated(), controller.recent)

module.exports = router
