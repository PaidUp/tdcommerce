'use strict'

'use strict';

const app = require('../../app');
const should = require('should');
const request = require('supertest');
const assert = require('chai').assert;
const config = require('../../config/environment/index');
const logger = require('../../config/logger');
const commerceAdapterSchedule = require(config.commerce.adapterSchedule);
const modelSpec = require('./commerce.model.spec.js');
const faker = require('faker');
let result = {}

describe.only("Commerce methods schedule (adapter)", function() {
  this.timeout(5000)

  it('create payment plan', function (done) {
    this.timeout(25000);
    commerceAdapterSchedule.paymentPlanCreate({name:'testName', destination:'destinationTest'}, function(err,data){
      if(err) return done(err);
      assert.isNull(err)
      assert.isString(data)
      assert.isNotNull(data);
      result.paymentplanId=data;
      done();
    })
  })

  it('update payment plans', function (done) {
  	var param = {paymentPlanId:result.paymentplanId,
        playmentPlanData: {name:'testName3',
        destination:'destinationTest3'}};
	  commerceAdapterSchedule.paymentPlanUpdate(param, function(err,data){
	  	if(err) return done(err);
	    assert.isNull(err)
	    assert.isTrue(data)
	    done();
	  });
  });

  it('info payment plans', function(done){
    var param = {paymentPlanId:result.paymentplanId};
    commerceAdapterSchedule.paymentPlanInfo(param, function(err,data){
    	if(err) return done(err);
      assert.isNull(err)
      assert.isObject(data)
      assert.equal('testName3', data.name);
      done();
    });
  });

  it('list payment plan', function (done) {
    this.timeout(25000);
    commerceAdapterSchedule.paymentPlanList({}, function(err,data){
      if(err) return done(err);
      assert.isNull(err)
      assert.isNotNull(data);
      assert.isArray(data)
      done();
    })
  })

  it('delete payment plans', function(done){
      this.timeout(25000);
      var param = {paymentPlanId:result.paymentplanId};
      commerceAdapterSchedule.paymentPlanDelete(param, function(err,data){
        assert.isNull(err)
        assert.isTrue(data)
        done();
      });
    });

})