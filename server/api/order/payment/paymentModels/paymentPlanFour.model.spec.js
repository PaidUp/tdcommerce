'use strict';

var faker = require('faker');
var moment = require('moment');

var paymentTwo = {
    name: faker.name.firstName,
    price: 1860,
    basePrice: 1800,
    intervalNumber: 2,
    deposit: 0,
    feePrice: 10,
    feeNumber: 6,
    dateStart: "1-Jun-2015",
    dateDeposit: "n/a",
    dateInterval: 1,
    dateFirstPayment: "1-Apr-2015"
}

module.exports = paymentTwo;

/*
Payments    
    every month
Parent pays $930.00
Stripe fee  $27.27

Distributions   
Team    $872.73
CS  $30.00
*/
