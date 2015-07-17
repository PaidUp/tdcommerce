'use strict';
var moment = require('moment');
var config = require('../../config/environment/index');
var ObjectId = require('mongoose').Types.ObjectId;

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

function calculateNextPaymentDue(nextPayment){
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
 * dateStart : string 'YYYY-MM-DD'
 * price : number
 * destinationId : string
 * deposit : number
 * dateDeposit : Date
 * }
 * @returns [*{}]
 */
function generateSchedule(params){

  if(!typeof params.intervalNumber === 'number'){
    throw new Error('intervalNumber is not a number');
  };
  if(!typeof params.dateStart === 'string'){
    throw new Error('dateStart is not a Date');
  };

  var schedule = {destinationId : params.destinationId , schedulePeriods : []};
  if(params.isInFullPay){
    schedule.schedulePeriods.push(parseSchedule(params.onePaymentSchedule));
  }else if(params.customizeSchedule){
    params.customizeSchedule.forEach(function(ele, pos, arr){
      schedule.schedulePeriods.push(parseSchedule(ele));
    });
  }else{
    var nextPayment = moment();

    if(params.deposit > 0){
      schedule.schedulePeriods.push(generateScheduleDeposit(params, 'Deposit'))
    }
    var price = paymentPeriod({
      intervalNumber : params.intervalNumber,
      price : params.price,
      deposit : params.deposit
    });
    var fee = calculateTotalFee(params) / params.intervalNumber;
    for(var i=0; i<params.intervalNumber;i++){
      var schedulePeriod = {};
      if(i === 0) {
        nextPayment = params.dateStart;
      }else{
        nextPayment = moment(nextPayment).add(params.intervalElapsed , params.intervalType).format();
      }
      schedulePeriod.id = new ObjectId();
      schedulePeriod.nextPayment = nextPayment;
      schedulePeriod.nextPaymentDue
        = calculateNextPaymentDue(nextPayment);
      schedulePeriod.price = price;
      schedulePeriod.fee = fee;
      schedulePeriod.description = 'Season Fee';
      schedule.schedulePeriods.push(schedulePeriod);
    }
  }


  return schedule;
}

function parseSchedule(customizeSchedule){
  var nPayment = customizeSchedule.date + ' ' + customizeSchedule.time;
  var ds = {
    id : new ObjectId(),
    nextPayment : nPayment,
    nextPaymentDue : calculateNextPaymentDue(nPayment),
    price : parseFloat(Math.ceil(customizeSchedule.price * 100) / 100).toFixed(2),
    fee:parseFloat(Math.ceil(customizeSchedule.fee * 100) / 100).toFixed(2),
    description : customizeSchedule.description
  }

  return ds;
};

function paymentPeriod(params){
  if(!typeof params.intervalNumber === 'number' && params.intervalNumber != 0){
    throw new Error('intervalNumber is not a number');
  };
  if(!typeof params.price === 'number'){
    throw new Error('price is not a number');
  };
  return   parseFloat(Math.ceil(((params.price - params.deposit) / params.intervalNumber) * 100) / 100).toFixed(2);
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

function generateScheduleDeposit(params, description){
  if(!typeof params.deposit === 'number'){
    throw new Error('deposit is not a number');
  };

  if(!typeof params.dateDeposit === 'object'){
    throw new Error('DateDeposit is not a Date');
  };
  var depositSchedule = {
    id : new ObjectId(),
    nextPayment : params.dateDeposit,
    nextPaymentDue : calculateNextPaymentDue(params.dateDeposit),
    price : parseFloat(Math.ceil(params.deposit * 100) / 100).toFixed(2),
    fee:0,
    description : description
  }

  return depositSchedule;
}

module.exports = {
  calculateTotalFee:calculateTotalFee,
  calculateNextPaymentDue:calculateNextPaymentDue,
  generateSchedule:generateSchedule,
  paymentPeriod:paymentPeriod,
  calculatePaymentFee:calculatePaymentFee,
  generateScheduleDeposit:generateScheduleDeposit
}
