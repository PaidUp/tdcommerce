'use strict'

let express = require('express')
let controller = require('./order.controller')
let authServer = require('../auth/auth.service')

let router = express.Router()

router.post('/search', authServer.isAuthenticated(), controller.searchOrder)


module.exports = router
