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
var moment = require('moment');

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

    it('calculate next payment Yet now' , function(done){
      var np = paymentService.calculateNextPaymentYet(modelSpecTwo.dateStart);
      assert.equal(np , modelSpecTwo.dateStart);
      done();
    });

    it('calculate next payment Yet before' , function(done){

      var test = moment(moment(), "DD-MM-YYYY").subtract(5,'days').format();
      var np = paymentService.calculateNextPaymentYet(test);
      assert.equal(np , moment(moment(), "DD-MM-YYYY").add(1,'days').format());
      done();
    });

    it('calculate next payment Yet after' , function(done){
      var test = moment(moment(), "DD-MM-YYYY").add(5,'days').format();
      var np = paymentService.calculateNextPaymentYet(test);
      assert.equal(np , test);
      done();
    });

    it('Payment period' , function(done){
      var pp = paymentService.paymentPeriod({
        intervalNumber:modelSpecTwo.intervalNumber,
        price : modelSpecTwo.price
      });
      assert.equal(pp, 335);//TODO: question aobut this result.
      done();
    });

    it.skip('generate schedule' , function(done){
      var paymentMonth = paymentService.generateSchedule({
        intervalNumber : modelSpecTwo.intervalNumber,
        price : modelSpecTwo.price
      });
      modelSpecTwo.paymentMonth = paymentMonth;
      assert.equal(paymentMonth, modelSpecTwo.price / modelSpecTwo.intervalNumber);
      done();
    });

    it.skip('calculate payment (stripe) fee' , function(done){
      var paymentFee = 0.029;
      var paymentFeeFixed = 0.3;
      var feeMonth = paymentService.calculatePaymentFee({
        paymentFee:paymentFee,
        paymentFeeFixed : paymentFeeFixed,
        paymentMonth : modelSpecTwo.paymentMonth
      });
      assert.equal(feeMonth, 10.015);//TODO: question aobut this result.
      done();
    });
});