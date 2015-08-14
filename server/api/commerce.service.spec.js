'use strict';

var config = require('../config/environment/index');
var service = require('./commerce.service');
var assert = require('chai').assert;

describe('commerce service', function(){
  this.timeout(30000);
  it.skip('retry payment' , function(done){
    service.retryPayment(function(err, data){
      assert(data);
      done()
    })
  });

  it.only('complete orders' , function(done){
    service.completeOrders(function(err , data){
      assert(data);
      done();
    });
  });
});
