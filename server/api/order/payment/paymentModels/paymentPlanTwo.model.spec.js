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
    dateStart: "1-Jun-2015",
    DateDeposit: "1-May-2015",
    DateInterval: 1,
    DateFirstPayment: "1-Jun-2015"
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