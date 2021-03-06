'use strict';
var faker = require('faker');

var data = {
    userId:'',
    email:faker.internet.email(),
    firstName : faker.name.firstName(),
    lastName : faker.name.lastName(),
    fullName : function(){
        return this.firstName + ' ' + this.lastName;
    },
    password : 'Querty1!',
    gender : 'male',
    token:'',
    quoteId:'',
    orderId:0,
    childId:'',
    customerId : '',
    customerAddressId : '',
    typeRelation : 'child cronjob',
    cartId:'',
    loanUserId:'',
    applicationId:'',
    loanId:'',
    productsCart : [{productId:"110",sku:"NORTH TEXAS BANDITOS - 7U BLACK",qty:1,options:{'10':'26','11':'28'}}],
    loanUserData : function(){
        return {firstName:this.firstName,lastName:this.lastName,ssn:"123456789"};
    },
    ssnLast4Digists : "6789",
    loan:'',
    bankId:'',
    verificationId:'',
    bankDetails:function(){
        return {
            name: this.fullName(),
            account_number: "9900826301",
            routing_number: "021000021"
        }
    }
};

module.exports = data;
