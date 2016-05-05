'use strict'

let express = require('express')
let controller = require('./order.controller')
let authServer = require('../auth/auth.service')

let router = express.Router()

router.post('/search', authServer.isAuthenticated(), controller.searchOrder)
router.get('/recent/:userId/:limit', authServer.isAuthenticated(), controller.recent)
router.get('/next/:userId/:limit', authServer.isAuthenticated(), controller.next)

module.exports = router
