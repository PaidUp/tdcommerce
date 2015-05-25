/**
 * Created by riclara on 5/22/15.
 */
'use strict';

var paymentService = require('./payment.service');
var modelSpec = require('./paymentModels/paymentPlanOne.model.spec');
var modelSpecTwo = require('./paymentModels/paymentPlanTwo.model.spec');
var modelSpecThree = require('./paymentModels/paymentPlanThree.model.spec');
var modelSpecFour = require('./paymentModels/paymentPlanFour.model.spec');
var assert = require('chai').assert;

describe('flow payment schedule One', function(){
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

describe.only('Payment plan Two', function(){
    it('total fee' , function(done){
      var totalFee = paymentService.calculateTotalFee({
        feePrice : modelSpecTwo.feePrice,
        feeNumber : modelSpecTwo.feeNumber
      });
      assert.equal(totalFee , 60);
      modelSpecTwo.totalFee = Number(totalFee);
      done();
    });

    it('total price' , function(done){
      var totalPrice = paymentService.calculateTotalPrice({
        basePrice : modelSpecTwo.basePrice,
        deposit : modelSpecTwo.deposit,
        totalFee : modelSpecTwo.totalFee
      });
      assert.equal(totalPrice , modelSpecTwo.price);
      done();
    });

    it('calculate schedule' , function(done){
      var schedule = paymentService.calculateSchedule({
        intervalNumber : modelSpecTwo.intervalNumber,
        dateStart : modelSpecTwo.dateStart
      });
      assert.equal(schedule.length , modelSpecTwo.intervalNumber);
      assert.equal(schedule[0] , modelSpecTwo.dateStart);
      done();
    });
});