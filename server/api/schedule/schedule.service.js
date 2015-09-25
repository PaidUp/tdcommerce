'use strict';
var moment = require('moment');
var config = require('../../config/environment/index');
var ObjectId = require('mongoose').Types.ObjectId;
var logger = require('../../config/logger');

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
  var resp = np.format();
  if(resp === 'Invalid date'){
    logger.error('invalid date: '+nextPayment );
    throw new Error('invalid date');
    return null;
  }
  return resp;
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
  //console.log('-----');
  //console.log('generateSchedule.params',params);
  //console.log('-----');
  try{
    if(!typeof params.intervalNumber === 'number'){
      throw new Error('intervalNumber is not a number');
    };
    if(!typeof params.dateStart === 'string'){
      throw new Error('dateStart is not a Date');
    };

    var schedule = {destinationId : params.destinationId , schedulePeriods : []};
    if(params.isInFullPay){
      schedule.schedulePeriods.push(parseSchedule(params.price, params.onePaymentSchedule, params.discount));
    }else if(params.customizeSchedule){
      params.customizeSchedule.forEach(function(ele, pos, arr){
        var discount = parseFloat(params.discount * (ele.percent / 100));
        schedule.schedulePeriods.push(parseSchedule(params.price, ele, discount));
      });
    }else{
      throw Error('onePaymentSchedule or customizeSchedule must be defined');
      /*
      var nextPayment = moment();

      if(params.deposit > 0){
        schedule.schedulePeriods.push(generateScheduleDeposit(params, 'Deposit'))
      }
      var price = paymentPeriod({
        intervalNumber : parseFloat(params.intervalNumber),
        price : parseFloat(params.price),
        deposit : parseFloat(params.deposit)
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
      }*/
    }
    return schedule;
  }catch(err){
    logger.error(err);
    return {error : err}
  }
}

function parseSchedule(price, customizeSchedule, discountFee){
  var disc = discountFee ? parseFloat(discountFee) : 0;
  var mom = moment(customizeSchedule.date + ' ' + customizeSchedule.time);
  var nPayment = mom.format();
  if(nPayment === 'Invalid date'){
    logger.error('invalid date: '+nPayment );
    throw new Error('invalid date');
  }

  if(isNaN(price)){
    logger.error('price not is a number: '+price );
    throw new Error('price not is a number');
  }

  var priceDue = calculatePrice(price  , customizeSchedule.percent).toFixed(2);
  if(isNaN(priceDue)){
    logger.error('priceDue not is a number: '+priceDue );
    throw new Error('priceDue not is a number');
  }

  var fee = parseFloat((((customizeSchedule.fee/100) * ((priceDue+disc) / (1+(customizeSchedule.fee/100))))-disc).toFixed(2));

  if(isNaN(fee)){
    logger.error('fee not is a number: '+nPayment );
    throw new Error('fee not is a number');
  }
  if(fee < 0){
    logger.error('fee must be a positive number: '+fee );
    throw new Error('fee must be a positive number, verify the value of order discount');
  }

  var ds = {
    id : new ObjectId(),
    nextPayment : nPayment,
    nextPaymentDue : calculateNextPaymentDue(nPayment),
    price : priceDue.toString(),
    percent : customizeSchedule.percent,
    fee:fee.toFixed(2),
    feePercent:customizeSchedule.fee,
    description : customizeSchedule.description,
    discountToFee : discountFee
  }
  return ds;
};


function calculatePrice(totalPrice, percent){
  if(isNaN(totalPrice)){
    logger.error('totalPrice not is a number: '+totalPrice );
    throw new Error('totalPrice not is a number');
  }

  if(isNaN(percent)){
    logger.error('percent not is a number: '+percent );
    throw new Error('percent not is a number');
  }

  var tmp = totalPrice * (percent / 100);
  return parseFloat(tmp);

}
/*
function paymentPeriod(params){
  if(typeof params.intervalNumber !== 'number' || params.intervalNumber == 0){
    throw new Error('intervalNumber is not a number');
  };
  if(typeof params.price !== 'number'){
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
*/
module.exports = {
  //calculateTotalFee:calculateTotalFee,
  //calculateNextPaymentDue:calculateNextPaymentDue,
  generateSchedule:generateSchedule,
  //paymentPeriod:paymentPeriod,
  //calculatePaymentFee:calculatePaymentFee,
  //generateScheduleDeposit:generateScheduleDeposit
}
