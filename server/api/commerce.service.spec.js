'use strict';

var config = require('../config/environment/index');
var service = require('./commerce.service');
var assert = require('chai').assert;

describe('commerce service', function(){
  this.timeout(10000);
  it('retry payment' , function(done){
    service.retryPayment(function(err, data){
      assert(data);
      done()
    })
  });

  it('complete orders' , function(done){
    service.completeOrders(function(err , data){
      assert(data);
      done();
    });
  });
});
