'use strict';

var config = require('../config/environment/index');
var service = require('./commerce.service');
var assert = require('chai').assert;

describe.skip('commerce service', function(){
  it('retry payment' , function(done){
    this.timeout(30000);
    service.retryPayment(function(err, data){
      assert(data);
      done()
    })
  });
});
