'use strict'

let express = require('express')
let controller = require('./order.controller')
let authServer = require('../auth/auth.service')

let router = express.Router()

router.post('/search', authServer.isAuthenticated(), controller.searchOrder)
router.get('/charge/notification/gt/:gtIsoDate/lt/:ltIsoDate', authServer.isAuthenticated(), controller.getOrdersForChargeNotification)
router.get('/recent/:userId/:limit', authServer.isAuthenticated(), controller.recent)
router.post('/cancel', authServer.isAuthenticated(), controller.cancelOrder)
router.post('/payments/remove', authServer.isAuthenticated(), controller.removePaymentPlan)
router.get('/next/:userId/:limit', authServer.isAuthenticated(), controller.next)
router.get('/active/:userId/:limit', authServer.isAuthenticated(), controller.active)

router.get('/organization/:organizationId/:limit/:sort/:from/:to', authServer.isAuthenticated(), controller.getOrderOrganization)

router.get('/transactions', authServer.isAuthenticated(), controller.transactionDetails)
router.get('/transactions/organization/:organizationId', authServer.isAuthenticated(), controller.transactionDetails)


module.exports = router
