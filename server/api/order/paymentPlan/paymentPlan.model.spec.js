'use strict'

let faker = require('faker')
const uuid = require('uuid')

module.exports = function PyamentPlan () {
  let randomDate = faker.date.between(faker.date.past(), faker.date.future())
  let wp = false
  let st = 'pending'
  if (randomDate < new Date()) {
    wp = true
    st = 'complete'
  }
  return {
    destinationId: uuid.v4(),
    dateCharge: randomDate,
    wasProcessed: wp,
    status: st,
    price: faker.random.number(),
    typeAccount: 'typeAccount',
    account: 'account',
    createDate: faker.date.recent(),
    attempts: [],
    processingFees: {
      cardFee: 2.9,
      cardFeeActual: 2.9,
      cardFeeFlat: 0.3,
      cardFeeFlatActual: 0.3,
      achFee: 0,
      achFeeActual: 0,
      achFeeFlat: 0,
      achFeeFlatActual: 0
    },
    collectionsFee: {
      fee: 5,
      feeFlat: 0
    },
    paysFees: {
      processing: true,
      collections: true
    },
    productInfo: {
      productId: 'productId',
      productName: faker.company.companyName() // etc..
    },
    userInfo: { // user - corporation
      userId: 'userId',
      userName: 'userName'
    },
    beneficiaryInfo: { // child - corporation
      beneficiaryId: 'parentId',
      // description, lastName
      beneficiaryName: 'parentName'
    }
  }
}
