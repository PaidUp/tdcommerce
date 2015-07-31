'use strict';

var config = require('../config/environment/index');
var service = require('./commerce.service');

describe.only('commerce service', function(){
  it('retry payment' , function(done){
    this.timeout(30000);
    service.retryPayment(function(err, data){
      //console.log('err',err);
      console.log('data' ,JSON.stringify(data));
      //done()
    })


  });
});
