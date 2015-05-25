'use strict';

var faker = require('faker');
var moment = require('moment');

var paymentTwo = {
    name: faker.name.firstName,
    price: 1860,
    basePrice: 1800,
    intervalNumber: 3,
    deposit: 0,
    feePrice: 10,
    feeNumber: 6,
    dateStart: moment("01-04-2015", "DD-MM-YYYY").format(),
    dateDeposit: null,
    intervalElapsed: 1,
    intervalType: 'month',
    dateFirstPayment: moment("01-04-2015", "DD-MM-YYYY").format(),

    paymentMonth:0
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
