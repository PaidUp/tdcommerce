'use strict'

let express = require('express')
let controller = require('./order.controller')
let authServer = require('../auth/auth.service')

let router = express.Router()

router.post('/search', authServer.isAuthenticated(), controller.searchOrder)
router.get('/recent/:userId/:limit', authServer.isAuthenticated(), controller.recent)
router.get('/next/:userId/:limit', authServer.isAuthenticated(), controller.next)
router.get('/active/:userId/:limit', authServer.isAuthenticated(), controller.active)

router.get('/organization/:organizationId/:limit/:sort', authServer.isAuthenticated(), controller.getOrderOrganization)

module.exports = router
