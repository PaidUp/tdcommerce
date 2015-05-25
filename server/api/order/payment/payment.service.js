'use strict';
var moment = require('moment');
var config = require('../../../config/environment/index');

/*
params : {
  feePrice : number,
  feeNumber : number
}
 */

function calculateTotalFee(params){
  if(!typeof params.feePrice === 'number'){
    throw new Error('feePrice is not a number');
  }
  if(!typeof params.feeNumber === 'number'){
    throw new Error('feePrice is not a number');
  }
  return (params.feePrice * params.feeNumber).toFixed(0);

}

/*
 params : {
 basePrice : number,
 deposit : number,
 totalFee : number
 }
 */
function calculateTotalPrice(params){
  if(!typeof params.basePrice === 'number'){
    throw new Error('basePrice is not a number');
  };
  if(!typeof params.deposit === 'number'){
    throw new Error('deposit is not a number');
  };
  if(!typeof params.totalFee === 'number'){
    throw new Error('totalFee is not a number');
  };
  return (params.basePrice + params.deposit + params.totalFee).toFixed(0);
}

function calculateNextPaymentYet(nextPayment){
  var np = moment(nextPayment);
  if(np.isBefore(moment())){
      np = moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType);
  }
  return np.format();
};

/**
 * Generate list objects next payments
 * @param params object {
 * intervalNumber : number
 * intervalType : 'string'
 * intervalElapsed : number
 * dateStart : string 'DD-MM-YYYY'
 * price : number
 * destinationId : string
 * deposit : number
 * dateDeposit : Date
 * }
 * @returns [*{}]
 */
function generateSchedule(params){
  var ret = [];

  if(!typeof params.intervalNumber === 'number'){
    throw new Error('intervalNumber is not a number');
  };
  if(!typeof params.dateStart === 'string'){
    throw new Error('dateStart is not a Date');
  };
  var price = paymentPeriod({
    intervalNumber : params.intervalNumber,
    price : params.price
  });

  var nextPayment;
  var schedule = {destinationId : params.destinationId , schedulePeriods : []};
  if(params.deposit > 0){
    schedule.schedulePeriods.push(generateScheduleDeposit(params))
  }
  var fee = calculateTotalFee(params) / params.intervalNumber;
  for(var i=0; i<params.intervalNumber;i++){
    var schedulePeriod = {};
    if(i === 0) {
      nextPayment = params.dateStart;
    }else{
      nextPayment = moment(nextPayment).add(params.intervalElapsed , params.intervalType).format();
    }
    schedulePeriod.nextPayment = nextPayment;
    schedulePeriod.nextPaymentYet = calculateNextPaymentYet(nextPayment);
    schedulePeriod.price = price;
    schedulePeriod.fee = fee;

    schedule.schedulePeriods.push(schedulePeriod);
  }
  return schedule;
}

function paymentPeriod(params){
  if(!typeof params.intervalNumber === 'number' && params.intervalNumber != 0){
    throw new Error('intervalNumber is not a number');
  };
  if(!typeof params.price === 'number'){
    throw new Error('price is not a number');
  };
  return params.price / params.intervalNumber;
}

function calculatePaymentFee(params){//TDPayment
  if(!typeof params.paymentFee === 'number'){
    throw new Error('paymentFee is not a number');
  };
  if(!typeof params.paymentFeeFixed === 'number'){
    throw new Error('paymentFeeFixed is not a number');
  };
  if(!typeof params.paymentMonth === 'number'){
    throw new Error('paymentMonth is not a number');
  };
  return (params.paymentMonth * params.paymentFee) + params.paymentFeeFixed;
}

function generateScheduleDeposit(params){
  if(!typeof params.deposit === 'number'){
    throw new Error('deposit is not a number');
  };

  if(!typeof params.dateDeposit === 'object'){
    throw new Error('DateDeposit is not a Date');
  };
  var depositSchedule = {
    nextPayment : params.dateDeposit,
    nextPaymentYet : calculateNextPaymentYet(params.dateDeposit),
    price : params.deposit,
    fee:0
  }

  return depositSchedule;
}

module.exports = {
  calculateTotalFee:calculateTotalFee,
  calculateTotalPrice:calculateTotalPrice,
  calculateNextPaymentYet:calculateNextPaymentYet,
  generateSchedule:generateSchedule,
  paymentPeriod:paymentPeriod,
  calculatePaymentFee:calculatePaymentFee,
  generateScheduleDeposit:generateScheduleDeposit
}
