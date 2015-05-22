/**
 * Created by riclara on 5/22/15.
 */
'use strict';

var paymentService = require('./payment.service');
var modelSpec = require('../paymentModels/payment.service');
var assert = require('chai').assert;

describe('flow payment schedule', function(){
  describe('calculate prices', function(){
    it('total fee' , function(done){
      var totalFee = paymentService.calculateTotalFee({
        feePrice : modelSpec.feePrice,
        feeNumber : modelSpec.feeNumber
      });
      assert.equal(totalFee , 60);
      done();
    });
  });

  describe('dummy', function(){
    it('dummy' , function(done){
      done();
    });
  });

});
