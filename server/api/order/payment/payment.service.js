'use strict';

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
  console.log('params.basePrice',params.basePrice);
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

module.exports = {
  calculateTotalFee:calculateTotalFee,
  calculateTotalPrice:calculateTotalPrice
}
