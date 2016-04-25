'use strict'

let express = require('express')
let controller = require('./order.controller')
let authServer = require('../auth/auth.service')

let router = express.Router()

router.post('/create', authServer.isAuthenticated(), controller.create)
router.post('/list', authServer.isAuthenticated(), controller.listV2)
router.post('/cronjob', authServer.isAuthenticated(), controller.listCronjob)
router.put('/update', authServer.isAuthenticated(), controller.update)
router.post('/add-payments', authServer.isAuthenticated(), controller.addPayments)
router.post('/update-payments', authServer.isAuthenticated(), controller.updatePayments)
router.get('/complete', authServer.isAuthenticated(), controller.completev3)

module.exports = router
