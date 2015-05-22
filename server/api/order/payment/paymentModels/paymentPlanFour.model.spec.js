'use strict';

var faker = require('faker');
var moment = require('moment');

var model = {
  name : faker.name.firstName,
  price : 1860,
  basePrice : 1800,
  intervalNumber : 6,
  deposit : 0,
  feePrice : 10,
  feeNumber : 6,
  dateStart : moment("01-06-2015", "DD-MM-YYYY"),
  dateDeposit : null,
  dateInterval : 1,
  dateFirstPayment : moment("01-06-2015", "DD-MM-YYYY")
}

module.exports = model;
