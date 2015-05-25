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

function calculateSchedule(params){
  if(!typeof params.intervalNumber === 'number'){
    throw new Error('intervalNumber is not a number');
  };
  if(!typeof params.dateStart === 'object'){
    throw new Error('dateStart is not a Date');
  };
  var schedule = [params.dateStart];
  for(var i=0; i<params.intervalNumber-1;i++){
    var nextPayment = moment(schedule[i]).add(1,'M').format();
    schedule.push(nextPayment);
  }
  return schedule;
}

module.exports = {
  calculateTotalFee:calculateTotalFee,
  calculateTotalPrice:calculateTotalPrice,
  calculateSchedule:calculateSchedule
}
