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
var config = require('../../../config/environment/index');

describe.only('Schedule general', function(){

  describe('flow payment schedule One', function(){
    it('generate schedule' , function(done){
      var data = {
        intervalNumber : modelSpec.intervalNumber,
        intervalType : modelSpec.intervalType,
        intervalElapsed : modelSpec.intervalElapsed,
        dateStart : modelSpec.dateStart,
        price : modelSpec.price,
        destinationId : 'temp 1',
        deposit : modelSpec.deposit,
        dateDeposit : modelSpec.dateDeposit,
        feePrice : modelSpec.feePrice,
        feeNumber : modelSpec.feeNumber
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      console.log('payment period' , paymentPeriod);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      done();
    });
  });

  describe('flow Payment schedule Two', function(){
      it('generate schedule' , function(done){
        var data = {
          intervalNumber : modelSpecTwo.intervalNumber,
          intervalType : modelSpecTwo.intervalType,
          intervalElapsed : modelSpecTwo.intervalElapsed,
          dateStart : modelSpecTwo.dateStart,
          price : modelSpecTwo.price,
          destinationId : 'temp 2',
          deposit : modelSpecTwo.deposit,
          dateDeposit : modelSpecTwo.dateDeposit,
          feePrice : modelSpecTwo.feePrice,
          feeNumber : modelSpecTwo.feeNumber
        }
        var paymentPeriod = paymentService.generateSchedule(data);
        console.log('payment period' , paymentPeriod);
        assert(paymentPeriod.destinationId);
        assert(paymentPeriod.schedulePeriods);
        done();
      });
  });

  describe('flow payment schedule Three', function(){
    it('generate schedule' , function(done){
      var data = {
        intervalNumber : modelSpecThree.intervalNumber,
        intervalType : modelSpecThree.intervalType,
        intervalElapsed : modelSpecThree.intervalElapsed,
        dateStart : modelSpecThree.dateStart,
        price : modelSpecThree.price,
        destinationId : 'temp3',
        deposit : modelSpecThree.deposit,
        dateDeposit : modelSpecThree.dateDeposit,
        feePrice : modelSpecThree.feePrice,
        feeNumber : modelSpecThree.feeNumber
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      console.log('payment period' , paymentPeriod);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      done();
    });
  });

  describe('flow payment schedule Four', function(){
    it('generate schedule' , function(done){
      var data = {
        intervalNumber : modelSpecFour.intervalNumber,
        intervalType : modelSpecFour.intervalType,
        intervalElapsed : modelSpecFour.intervalElapsed,
        dateStart : modelSpecFour.dateStart,
        price : modelSpecFour.price,
        destinationId : 'temp 4',
        deposit : modelSpecFour.deposit,
        dateDeposit : modelSpecFour.dateDeposit,
        feePrice : modelSpecFour.feePrice,
        feeNumber : modelSpecFour.feeNumber
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      console.log('payment period' , paymentPeriod);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      done();
    });
  });

  describe('Method services', function(){
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
      var np = paymentService.calculateNextPaymentDue(modelSpecTwo.dateStart);
      assert.equal(np , modelSpecTwo.dateStart);
      done();
    });

    it('calculate next payment Yet before' , function(done){

      var test = moment(moment(), "DD-MM-YYYY").subtract(5,'days').format();
      var np = paymentService.calculateNextPaymentDue(test);
      assert.equal(np , moment(moment(), "DD-MM-YYYY").add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      done();
    });

    it('calculate next payment Yet after' , function(done){
      var test = moment(moment(), "DD-MM-YYYY").add(5,'days').format();
      var np = paymentService.calculateNextPaymentDue(test);
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

    it('generate schedule deposit' , function(done){
      var ds = paymentService.generateScheduleDeposit({
        deposit:modelSpecTwo.deposit,
        dateDeposit : modelSpecTwo.dateDeposit
      });
      assert.equal(ds.nextPaymentYet, moment(moment(), "DD-MM-YYYY").add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());//TODO: question aobut this result.
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

});
