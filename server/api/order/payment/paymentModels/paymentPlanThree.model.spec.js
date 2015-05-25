'use strict';

var faker = require('faker');
var moment = require('moment');

var model = {
  name : faker.name.firstName,
  price : 1860,
  basePrice : 1800,
  intervalNumber : 2,
  deposit : 0,
  feePrice : 10,
  feeNumber : 6,
  dateStart : moment("01-06-2015", "DD-MM-YYYY").format(),
  dateDeposit : null,
  intervalElapsed: 1,
  intervalType: 'month',
  dateFirstPayment : moment("01-06-2015", "DD-MM-YYYY").format(),

  paymentMonth:0
}

module.exports = model;
