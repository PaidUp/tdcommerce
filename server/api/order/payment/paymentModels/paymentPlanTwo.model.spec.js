'use strict';

var faker = require('faker');
var moment = require('moment');

var paymentTwo = {
    name: "Austin Boom",
    price: 2010,
    basePrice: 1800,
    intervalNumber: 6,
    deposit: 150,
    feePrice: 10,
    feeNumber: 6,
    dateStart : moment("01-06-2015", "DD-MM-YYYY").format(),
    dateDeposit: moment("01-05-2015", "DD-MM-YYYY").format(),
    intervalElapsed: 1,
    intervalType: 'month',
    dateFirstPayment : moment("01-06-2015", "DD-MM-YYYY").format(),

    paymentMonth:0
}

module.exports = paymentTwo;

/*
Payments                
    1-May-2015          
Parent pays $150.00         
Stripe fee  $4.65           
                
Distributions               
Team    $145.35         
CS  $0.00   Note: CS does not get proffit on deposit!
*/