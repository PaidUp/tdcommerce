'use strict';

var config = require('../config/environment/index');
var service = require('./commerce.service');
var assert = require('chai').assert;

describe('commerce service', function(){
  it.skip('retry payment' , function(done){
    this.timeout(30000);
    service.retryPayment(function(err, data){
      assert(data);
      done()
    })
  });
});
