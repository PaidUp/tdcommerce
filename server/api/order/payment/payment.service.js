'use strict';
var moment = require('moment');

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
      np = moment().add(1,'days');
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
 * params.price : number
 * destinationId : string
 * }
 * @returns [*{}]
 */
function generateSchedule(params){
  var ret = [];

  if(!typeof params.intervalNumber === 'number'){
    throw new Error('intervalNumber is not a number');
  };
  //if(!typeof params.dateStart === 'string'){
  //  throw new Error('dateStart is not a Date');
  //};
  var price = paymentPeriod({
    intervalNumber : params.intervalNumber,
    price : params.price
  });

  var nextPayment;
  var schedule = {destinationId : params.destinationId , schedulePeriods : []};

  //TODO add deposit

  for(var i=0; i<params.intervalNumber-1;i++){
    var schedulePeriod = {};
    if(i === 0) {
      nextPayment = moment(params.dateStart, 'DD-MM-YYYY').format();
    }else{
      nextPayment.add(params.intervalElapsed , params.intervalType);
    }

    schedulePeriod.nextPayment = nextPayment.clone();
    schedulePeriod.nextPaymentYet = calculateNextPaymentYet(nextPayment);
    schedulePeriod.price = price;

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
  console.log('params',params);
  console.log('0',params.paymentMonth * params.paymentFee);
  return (params.paymentMonth * params.paymentFee) + params.paymentFeeFixed;
}

module.exports = {
  calculateTotalFee:calculateTotalFee,
  calculateTotalPrice:calculateTotalPrice,
  calculateNextPaymentYet:calculateNextPaymentYet,
  generateSchedule:generateSchedule,
  paymentPeriod:paymentPeriod,
  calculatePaymentFee:calculatePaymentFee
}
