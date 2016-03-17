'use strict'

let faker = require('faker')
const uuid = require('uuid')

module.exports = function Order () {
  return {
    status: 'pending',
    id: uuid.v4(),
    paymentsPlan: []
  }
}
