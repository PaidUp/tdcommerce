/**
 * Created by riclara on 5/22/15.
 */
'use strict';

var paymentService = require('./payment.service');
var modelSpec = require('./paymentModels/paymentPlanOne.model.spec');
var assert = require('chai').assert;

describe('flow payment schedule', function(){
  describe('calculate fee', function(){
    it('total fee' , function(done){
      var totalFee = paymentService.calculateTotalFee({
        feePrice : modelSpec.feePrice,
        feeNumber : modelSpec.feeNumber
      });
      assert.equal(totalFee , modelSpec.totalFee);
      modelSpec.totalFee = totalFee;
      done();
    });
  });

  it('total price' , function(done){
    console.log('modelSpec.totalFee',modelSpec.totalFee);
    var totalPrice = paymentService.calculateTotalPrice({
      basePrice : modelSpec.basePrice,
      deposit : modelSpec.deposit,
      totalFee : modelSpec.totalFee
    });
    assert.equal(totalPrice , modelSpec.price);
    done();
  });

});
