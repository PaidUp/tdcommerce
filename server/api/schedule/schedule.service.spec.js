/**
 * Created by riclara on 5/22/15.
 */
'use strict';

var paymentService = require('./schedule.service');
var modelSpec = require('./scheduleModels/schedule.model.spec.js');
var assert = require('chai').assert;
var moment = require('moment');
var config = require('../../config/environment/index');
var app = require('../../app');
var request = require('supertest');
var tokenTDCommerce = 'TDCommerceToken-CHANGE-ME!';

describe.only('Schedule general', function(){

  describe('flow Payment schedule One', function(){
    it('generate schedule startDate before 30 days without deposit' , function(done){
        var data = {
          name : 'BOOOOOOM',
          price : 1860,
          basePrice : 1800,
          intervalNumber : 6,
          deposit : 0,
          feePrice : 10,
          feeNumber : 6,
          dateStart : moment().subtract(30, 'days').format(),
          dateDeposit : null,
          intervalElapsed: 1,
          intervalType: 'month',
          dateFirstPayment : moment().subtract(30, 'days').format(),
          destinationId : 'temp 2'
        }
        var paymentPeriod = paymentService.generateSchedule(data);
        assert(paymentPeriod.destinationId);
        assert(paymentPeriod.schedulePeriods);

        assert(paymentPeriod.destinationId);
        assert(paymentPeriod.schedulePeriods);
        assert.lengthOf(paymentPeriod.schedulePeriods, 6, 'array has length of 6');
        assert.equal(paymentPeriod.schedulePeriods[0].nextPayment, data.dateStart);
        assert.equal(paymentPeriod.schedulePeriods[0].nextPaymentDue, moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[0].price, data.price / data.intervalNumber);
        assert.equal(paymentPeriod.schedulePeriods[0].fee,10);

        assert.equal(paymentPeriod.schedulePeriods[1].nextPayment, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[1].nextPaymentDue, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[1].price, data.price / data.intervalNumber);
        assert.equal(paymentPeriod.schedulePeriods[1].fee,10);

        assert.equal(paymentPeriod.schedulePeriods[2].nextPayment, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[2].nextPaymentDue, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[2].price, data.price / data.intervalNumber);
        assert.equal(paymentPeriod.schedulePeriods[2].fee,10);

        assert.equal(paymentPeriod.schedulePeriods[3].nextPayment, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[3].nextPaymentDue, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[3].price, data.price / data.intervalNumber);
        assert.equal(paymentPeriod.schedulePeriods[3].fee,10);

        assert.equal(paymentPeriod.schedulePeriods[4].nextPayment, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[4].nextPaymentDue, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[4].price, data.price / data.intervalNumber);
        assert.equal(paymentPeriod.schedulePeriods[4].fee,10);

        assert.equal(paymentPeriod.schedulePeriods[5].nextPayment, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[5].nextPaymentDue, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
        assert.equal(paymentPeriod.schedulePeriods[5].price, data.price / data.intervalNumber);
        assert.equal(paymentPeriod.schedulePeriods[5].fee,10);
        done();
      });

    it('generate schedule startDate before 15 days without deposit' , function(done){
      var data = {
        name : 'BOOOOOOM',
        price : 1860,
        basePrice : 1800,
        intervalNumber : 6,
        deposit : 0,
        feePrice : 10,
        feeNumber : 6,
        dateStart : moment().subtract(15, 'days').format(),
        dateDeposit : null,
        intervalElapsed: 1,
        intervalType: 'month',
        dateFirstPayment : moment().subtract(15, 'days').format(),
        destinationId : 'temp 2'
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);

      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      assert.lengthOf(paymentPeriod.schedulePeriods, 6, 'array has length of 6');
      assert.equal(paymentPeriod.schedulePeriods[0].nextPayment, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[0].nextPaymentDue, moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[0].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[0].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[1].nextPayment, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].nextPaymentDue, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[1].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[2].nextPayment, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].nextPaymentDue, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[2].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[3].nextPayment, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[3].nextPaymentDue, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[3].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[3].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[4].nextPayment, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[4].nextPaymentDue, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[4].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[4].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[5].nextPayment, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[5].nextPaymentDue, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[5].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[5].fee,10);
      done();
    });

    it('generate schedule startDate after 15 days without deposit' , function(done){
      var data = {
        name : 'BOOOOOOM',
        price : 1860,
        basePrice : 1800,
        intervalNumber : 6,
        deposit : 0,
        feePrice : 10,
        feeNumber : 6,
        dateStart : moment().add(15, 'days').format(),
        dateDeposit : null,
        intervalElapsed: 1,
        intervalType: 'month',
        dateFirstPayment : moment().add(15, 'days').format(),
        destinationId : 'temp 2'
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);

      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      assert.lengthOf(paymentPeriod.schedulePeriods, 6, 'array has length of 6');
      assert.equal(paymentPeriod.schedulePeriods[0].nextPayment, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[0].nextPaymentDue, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[0].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[0].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[1].nextPayment, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].nextPaymentDue, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[1].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[2].nextPayment, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].nextPaymentDue, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[2].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[3].nextPayment, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[3].nextPaymentDue, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[3].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[3].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[4].nextPayment, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[4].nextPaymentDue, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[4].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[4].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[5].nextPayment, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[5].nextPaymentDue, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[5].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[5].fee,10);
      done();
    });
  });

  describe('flow payment schedule Two', function(){
    it('generate schedule startDate before 30 days and deposit' , function(done){
      var data = {
        name: "Austin Boom",
        destinationId : "Austin Boom",
        price: 2010,
        basePrice: 1800,
        intervalNumber: 6,
        deposit: 150,
        feePrice: 10,
        feeNumber: 6,
        dateStart : moment().subtract(30, 'days').format(),
        dateDeposit: moment().subtract(30, 'days').format(),
        intervalElapsed: 1,
        intervalType: 'month'
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      assert.lengthOf(paymentPeriod.schedulePeriods, 7, 'array has length of 7');

      assert.equal(paymentPeriod.schedulePeriods[0].nextPayment, data.dateDeposit);
      assert.equal(paymentPeriod.schedulePeriods[0].nextPaymentDue, moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[0].price, data.deposit);
      assert.equal(paymentPeriod.schedulePeriods[0].fee,0);

      assert.equal(paymentPeriod.schedulePeriods[1].nextPayment, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[1].nextPaymentDue, moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[1].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[2].nextPayment, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].nextPaymentDue, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[2].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[3].nextPayment, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[3].nextPaymentDue, moment(paymentPeriod.schedulePeriods[2].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[3].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[3].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[4].nextPayment, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[4].nextPaymentDue, moment(paymentPeriod.schedulePeriods[3].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[4].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[4].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[5].nextPayment, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[5].nextPaymentDue, moment(paymentPeriod.schedulePeriods[4].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[5].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[5].fee,10);

      assert.equal(paymentPeriod.schedulePeriods[6].nextPayment, moment(paymentPeriod.schedulePeriods[5].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[6].nextPaymentDue, moment(paymentPeriod.schedulePeriods[5].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[6].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[6].fee,10);
      done();
    });
  });

  describe('flow payment schedule Three', function(){
    it('generate schedule startDate after 30 days without deposit' , function(done){
      var data = {
        name : 'BOOOOOOM',
        price : 1860,
        basePrice : 1800,
        intervalNumber : 2,
        deposit : 0,
        feePrice : 10,
        feeNumber : 6,
        dateStart : moment().add(30, 'days').format(),
        dateDeposit : null,
        intervalElapsed: 1,
        intervalType: 'month',
        dateFirstPayment : moment().subtract(30, 'days').format(),
        destinationId : 'temp 3'
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);

      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      assert.lengthOf(paymentPeriod.schedulePeriods, 2, 'array has length of 2');
      assert.equal(paymentPeriod.schedulePeriods[0].nextPayment, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[0].nextPaymentDue, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[0].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[0].fee,30);

      assert.equal(paymentPeriod.schedulePeriods[1].nextPayment, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].nextPaymentDue, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[1].fee,30);
      done();
    });
  });

  describe('flow payment schedule Four', function(){
    it('generate schedule' , function(done){
      var data = {
        name : 'BOOOOOOM',
        price : 1860,
        basePrice : 1800,
        intervalNumber : 3,
        deposit : 0,
        feePrice : 10,
        feeNumber : 6,
        dateStart : moment().subtract(60, 'days').format(),
        dateDeposit : null,
        intervalElapsed: 1,
        intervalType: 'month',
        destinationId : 'temp 3'
      }
      var paymentPeriod = paymentService.generateSchedule(data);
      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);

      assert(paymentPeriod.destinationId);
      assert(paymentPeriod.schedulePeriods);
      assert.lengthOf(paymentPeriod.schedulePeriods, 3, 'array has length of 3');
      assert.equal(paymentPeriod.schedulePeriods[0].nextPayment, data.dateStart);
      assert.equal(paymentPeriod.schedulePeriods[0].nextPaymentDue, moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[0].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[0].fee,20);

      assert.equal(paymentPeriod.schedulePeriods[1].nextPayment, moment(paymentPeriod.schedulePeriods[0].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].nextPaymentDue, moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[1].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[1].fee,20);

      assert.equal(paymentPeriod.schedulePeriods[2].nextPayment, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].nextPaymentDue, moment(paymentPeriod.schedulePeriods[1].nextPayment).add(data.intervalElapsed,data.intervalType).format());
      assert.equal(paymentPeriod.schedulePeriods[2].price, data.price / data.intervalNumber);
      assert.equal(paymentPeriod.schedulePeriods[2].fee,20);
      done();
    });
  });

  describe('Method services', function(){
    it('total fee' , function(done){
      var totalFee = paymentService.calculateTotalFee({
        feePrice : modelSpec.feePrice,
        feeNumber : modelSpec.feeNumber
      });
      assert.equal(totalFee , 60);
      modelSpec.totalFee = Number(totalFee);
      done();
    });

    it('total price' , function(done){
      var totalPrice = paymentService.calculateTotalPrice({
        basePrice : modelSpec.basePrice,
        deposit : modelSpec.deposit,
        totalFee : modelSpec.totalFee
      });
      assert.equal(totalPrice , modelSpec.price);
      done();
    });

    it('calculate next payment Due now' , function(done){
      var np = paymentService.calculateNextPaymentDue(modelSpec.dateStart);
      assert.equal(np , moment().add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      done();
    });

    it('calculate next payment Due before' , function(done){

      var test = moment(moment(), "DD-MM-YYYY").subtract(5,'days').format();
      var np = paymentService.calculateNextPaymentDue(test);
      assert.equal(np , moment(moment(), "DD-MM-YYYY").add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());
      done();
    });

    it('calculate next payment Due after' , function(done){
      var test = moment(moment(), "DD-MM-YYYY").add(5,'days').format();
      var np = paymentService.calculateNextPaymentDue(test);
      assert.equal(np , test);
      done();
    });

    it('Payment period' , function(done){
      var pp = paymentService.paymentPeriod({
        intervalNumber:modelSpec.intervalNumber,
        price : modelSpec.price
      });
      assert.equal(pp, 335);//TODO: question aobut this result.
      done();
    });

    it('generate schedule deposit' , function(done){
      var ds = paymentService.generateScheduleDeposit({
        deposit:modelSpec.deposit,
        dateDeposit : modelSpec.dateDeposit
      });
      assert.equal(ds.nextPaymentDue, moment(moment(), "DD-MM-YYYY").add(config.commerce.paymentPlan.intervalElapsed,config.commerce.paymentPlan.intervalType).format());//TODO: question aobut this result.
      done();
    });

    it.skip('calculate payment (stripe) fee' , function(done){
      var paymentFee = 0.029;
      var paymentFeeFixed = 0.3;
      var feeMonth = paymentService.calculatePaymentFee({
        paymentFee:paymentFee,
        paymentFeeFixed : paymentFeeFixed,
        paymentMonth : modelSpec.paymentMonth
      });
      assert.equal(feeMonth, 10.015);//TODO: question aobut this result.
      done();
    });

  });

  describe('Schedule controller', function(){
    it('/schedule/generate/product/8', function(done) {
      this.timeout(5000);
      request(app)
        .get('/api/v1/commerce/schedule/generate/product/8')
        .set('Authorization', tokenTDCommerce)
        .expect(200)
        .expect('Content-Type', 'application/json')
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.destinationId);
          assert.equal(res.body.destinationId,'acct_169MBqJMKBMd6ZYT');
          assert(res.body.schedulePeriods);
          assert.lengthOf(res.body.schedulePeriods, 7, 'array has length of 7');
          assert.equal(res.body.schedulePeriods[0].price,150);
          assert.equal(res.body.schedulePeriods[0].fee,0);
          assert.equal(res.body.schedulePeriods[1].price, 275);
          assert.equal(res.body.schedulePeriods[1].fee,10);
          done();
        });
    });

    it.skip('/api/v1/commerce/schedule/payments/order/000001698', function(done) {
      this.timeout(15000);
      request(app)
        .get('/api/v1/commerce/schedule/payments/order/000001698')///commecer/schedule/payments/{orderId/{status}
        .set('Authorization', tokenTDCommerce)
        .expect(200)
        .expect('Content-Type', 'application/json')
        .end(function(err, res) {
          if (err) return done(err);
          assert.operator(res.body.scheduled.length, '>', 0);
          done();
        });
    });

  });

});
