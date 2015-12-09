'use strict';

var app = require('../../app');
var should = require('should');
var request = require('supertest');
var assert = require('chai').assert;
var config = require('../../config/environment/index');
var logger = require('../../config/logger');
var commerceAdapter = require(config.commerce.adapter);
var modelSpec = require('./commerce.model.spec.js');
var faker = require('faker');

// Testing vars
modelSpec.quoteId;
modelSpec.orderId;

var MagentoAPI = require('magento');
var magento = new MagentoAPI(config.commerce.magento);

describe("Commerce methods (adapter)", function() {
  this.timeout(5000);

  it('category tree', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.catalogCategory.tree({}, function (err, res) {
        assert.equal(res.category_id, '1');
        assert.equal(res.name, 'Root Catalog');
        assert.operator(res.children[0].children.length, '>', 0);
        done();
      });
    });
  });

  it('category product list', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.catalogCategory.assignedProducts({
        categoryId: config.commerce.category.teams
      }, function (err, res) {
        assert.operator(res.length, '>', 0);
        done();
      });
    });
  });

  it('product view', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.catalogProduct.info({
        id: config.commerce.testing.teamId
      }, function (err, res) {
        magento.catalogProductAttributeMedia.list({
          product: config.commerce.testing.teamId
          }, function (err, resimg) {
            res.images = resimg;
            assert.notEqual(res.length, 0);
            assert.equal(res.images[0].file, "/n/t/ntxbanditos_1.png");
            done();
        });
      });
    });
  });

  it('product view images', function (done) {
    this.timeout(5000);
      magento.login(function (err, sessId) {
        if (err) {
          logger.info(err, err);
          done(err);
        }
        // use magento
        magento.catalogProductAttributeMedia.list({
          product: config.commerce.testing.teamId//110
        }, function (err, res) {
          assert.notEqual(res.length, 0);
          assert.equal(res[0].file, "/n/t/ntxbanditos_1.png");
          done();
        });
      });
  });

  it.skip('product view attributes required', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.catalogProductCustomOption.list({
      productId: config.commerce.testing.teamId
      }, function (err, res) {
        assert.operator(res.length, '>', 0);
        assert.equal(res[0].title, 'Payment Method');
        assert.equal(res[0].type, 'drop_down');
        assert.equal(res[1].title, 'test');
        done();
      });
    });
  });

  it.skip('product view attribute options', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.catalogProductCustomOptionValue.list({
        optionId: 0
      }, function (err, res) {
        assert.notEqual(res.length, 0);
        assert.equal(res[0].value_id, '7');
        assert.equal(res[0].title, 'Winter 2014-15');
        assert.equal(res[0].price_type, 'fixed');
        done();
      });
    });
  });

  it('category product related list link', function (done) {
    this.timeout(5000);
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.catalogProductLink.list({
        product: config.commerce.testing.teamId,
        type:'related'
      }, function (err, res) {
        assert.operator(res.length,'>',0);
        done();
      });
    });
  });

  function cartCreate(cb) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        return cb(err);
      }
      // use magento
      magento.checkoutCart.create({
        storeView: '1'
      },function (err, res) {
        if(err) return cb(err);
        //return idCart
        assert.notEqual(res, 0);
        modelSpec.quoteId = res;
        return cb(null, res);
      });
    });
  }

  it('cart create', function (done) {
    cartCreate(function(err, data) {
      if(err) done(err);
      done();
    });
  });

  // cart add
  function cartAdd(cb) {
    magento.login(function (err, sessId) {
      if (err) {
        if(err) return cb(err);
        return cb(null, res);
      }
      var shoppingCartProductEntityArray = {
        product_id: 110,
        sku: "NORTH TEXAS BANDITOS - 7U BLACK",
        qty: 1,
        options: {"2" : "7", "1" : "3"},
        bundle_option: [],
        bundle_option_qty: [],
        links: {}
      };
      // use magento
      magento.checkoutCartProduct.add({quoteId: modelSpec.quoteId, products:[shoppingCartProductEntityArray]}, function (err, res) {
        if(err) return cb(err);
        return cb(null, res);
      });
    });
  }

  it('cart add', function (done) {
    cartAdd(function(err, data){
      if(err) done(err);
      else done();
    });
  });

  it('cart addresses', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCartCustomer.addresses({
        quoteId: modelSpec.quoteId,
        customerAddressData:[
          {
            mode: "billing",
            firstname: "Ignacio",
            lastname: "Pascual",
            street: "801 east 11th st",
            address2: "801 east 11th st",
            city: "Austin",
            region: "TX",
            postcode: "78702",
            country_id: "US",
            telephone: "+1 320123245"
          },
          {
            mode: "shipping",
            firstname: "Ignacio",
            lastname: "Pascual",
            street: "801 east 11th st",
            address2: "801 east 11th st",
            city: "Austin",
            region: "TX",
            postcode: "78702",
            country_id: "US",
            telephone: "+1 320123245"
          }
        ]
      }, function (err, res) {
        assert.equal(res, true);
        done();
      });
    });
  });

  it('cart totals before coupon', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCart.totals({
        quoteId: modelSpec.quoteId,
      }, function (err, res) {
        assert.operator(res.length, '>', 0);
        assert.equal(res[0].title, 'Subtotal');
        assert.equal(res[1].title, 'Grand Total');
        done();
      });
    });
  });

  it('checkout set shipping method', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCartShipping.method({
        quoteId: modelSpec.quoteId,
        shippingMethod: "freeshipping_freeshipping"
      }, function (err, res) {
        if(err) done(err);
        else done();
        assert.equal(res, true);
      });
    });
  });

  it('checkout set payment method', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCartPayment.method({
        quoteId: modelSpec.quoteId,
        paymentData: {
          po_number: "Order: BP-order-1111111 / Customer: BP-customer-1111112",
          method: "purchaseorder"
        }
      }, function (err, res) {
        if(err) done(err);
        assert.equal(res, true);
        done();
      });
    });
  });

  it('cart totals bf coupon', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCart.totals({
        quoteId: modelSpec.quoteId,
      }, function (err, res) {
        //assert.operator(res.length, '>', 0);
        done();
      });
    });
  });

  it('cart add coupon', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCartCoupon.add({
        quoteId: modelSpec.quoteId,
        couponCode: 'JJCALATC0935',
        storeView:'1'
      }, function (err, res) {
        assert.equal(res,true);
        done();
      });
    });
  });

  it('cart totals after coupon', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCart.totals({
        quoteId: modelSpec.quoteId,
      }, function (err, res) {
        assert.operator(res.length, '>', 0);
        assert.equal(res[0].title, 'Subtotal');
        assert.equal(res[1].title, 'Discount (JJCALATC0935)');
        done();
      });
    });
  });


  it('checkout place order', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.checkoutCart.order({
        quoteId: modelSpec.quoteId
      }, function (err, orderId) {
        if(err) {
          done(err);
        }
        else {
          assert.operator(orderId, ">", 0);
          modelSpec.orderId = orderId;
          done();
        }
      });
    });
  });

  it('checkout add comment to order', function (done) {
    var myComment = {
      "destinationId":"acct_16N29JCSxGRWBMDD",
      "schedulePeriods":[
        {"id":"55b7f7055a02911733037220",
        "nextPayment":"2015-07-10T00:00:00-05:00",
        "nextPaymentDue":"2015-07-28T16:46:25-05:00",
        "price":2020,"fee":10.2,
        "description":"first pay"}],
      "meta":{"org_name":"NORTH TEXAS BANDITOS - 7U BLACK",
        "sku":"NORTH TEXAS BANDITOS - 7U BLACK-PMINFULL-TEST1SKU",
        "athlete_first_name":"son",
        "athlete_last_name":"son"}
    };
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      magento.salesOrder.addComment({
        orderIncrementId: modelSpec.orderId,
        status: "pending",
        comment: JSON.stringify(myComment)
      }, function (err, res) {
        if(err) {
          done(err);
        }
        else {
          assert.isNotNull(res);
          done();
        }
      });
    });
  });

  it('create order transaction', function (done) {
    magento.login(function (err, sessId) {
      if (err) {
        logger.info(err, err);
        done(err);
      }
      // use magento
      magento.bighippoSales.createTransaction(
          { orderId: modelSpec.orderId,
            transactionId: faker.random.number(9999999999999),
            addInfo: {amount:123, test:345}
          }, function (err, res) {
        if(err) {
          done(err);
        }
        else {
          assert.isNull(err);
          assert.isNotNull(res);
          assert.isNotNull(res.transactionId);
          done();
        }
      });
    });
  });

  it('cart remove', function (done) {
    cartCreate(function(err, data){
      cartAdd(function(err, data){
        if(err) done(err);
        magento.login(function (err, sessId) {
          if (err) {
            logger.info(err, err);
            done(err);
          }
          magento.checkoutCartProduct.remove({quoteId:modelSpec.quoteId, productsData:{sku: "NORTH TEXAS BANDITOS - 7U BLACK", qty: "1", options: {"2" : "7", "1" : "3"}}}, function (err, res) {
            assert.equal(res, true);
            done();
          });
        });
      });
    });
  });

  it('order load', function (done) {
    var orderId = modelSpec.orderId;
    commerceAdapter.orderLoad(orderId, function(err, data){
      assert.isNull(err);
      assert.isNotNull(data);
      assert.isNotNull(data.sku);
      assert.isNotNull(data.productId);
      assert.isNotNull(data.paymentMethod);
      assert.isNotNull(data.athleteId);
      done();
    });
  });

  it('order list commerce', function (done) {
    this.timeout(5000);
    commerceAdapter.orderList({status: "pending"}, function(err, data){
      assert.isNull(err);
      assert.isNotNull(data);
      done();
    });
  });

  it('create customer', function(done) {
    var user = {
      firstName: modelSpec.firstName,
      lastName: modelSpec.lastName,
      email: modelSpec.email,
      gender: modelSpec.gender
    };
    commerceAdapter.createCustomer(user, function(err, data){
      if(err) return done(err);
      assert.isNotNull(data);
      modelSpec.customerId = data;
      done();
    });
  });

  it('create customer address', function(done) {
    var address = {mode: 'billing-shipping', "firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"};

    commerceAdapter.createCustomerAddress(modelSpec.customerId, address, function(err, data){
      if(err) return done(err);
      assert.isNotNull(data);
      modelSpec.customerAddressId = data;
      done();
    });
  });

  it('delete all customer addresses', function(done) {
    //TODO
    // magento.customerAddress.list
    // magento.customerAddress.delete
    done();
  })

  it('merge all customer addresses', function(done) {
    //TODO
    // delete all address
    // create user address on Magento
    done();
  })

  it('list order transactions', function (done) {
    this.timeout(25000);

    commerceAdapter.transactionList(19, function(err,data){
      if(err) return done(err);
      assert.equal(0, data.length)
      assert.isNotNull(data);
      done();
    });
  });

  it('create (catalog) group product', function (done) {
    this.timeout(25000);
    var testDataProduct = {
      type:'grouped',//
      set:'9',// should be 9 for Team attibute set.
      sku:faker.random.uuid(),
      data: {
        name:faker.company.companyName(),
        websites:['1'],
        shortDescription:'short_description',
        description:'description',
        status:'1',
        price:faker.finance.amount(),
        taxDlassId:'0',
        urlKey:'product-url-key',
        urlPath:'url_path',
        visibility:'4',// should be 4
        categories:['3'],// should be 3
        categoryIds:['3'],// should be 3.
        balancedCustomerId:'balanced_customer_id1',
        tdPaymentId:'t_d_customer_id1'
      }
    };
    commerceAdapter.catalogCreate(testDataProduct, function(err,data){
      if(err) return done(err);
      assert.isNotNull(data);
      done();
    });
  });

  it('list Simple Products error missing value for productId', function (done) {
    this.timeout(25000);
    commerceAdapter.listSimpleProducts({}, function(err,data){
      assert.equal('missing value for "productId"', err.message)
      assert.equal('listSimpleProducts', err.method)
      done();
    });
  });

  it('list Simple Products', function (done) {
    this.timeout(25000);

    commerceAdapter.listSimpleProducts({productId:105, arguments: [], includeMedia :true}, function(err,data){
      if(err) return done(err);
      assert.isNotNull(data);
      done();
    });
  });

  it.skip('list grouped Products', function (done) {
    this.timeout(25000);

    commerceAdapter.listGroupedProducts({}, function(err,data){
      if(err) return done(err);
      assert.isNotNull(data);
      done();
    });
  });

});

