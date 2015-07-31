var config = require('../../config/environment');
var MagentoAPI = require('magento');
var magento = new MagentoAPI(config.commerce.magento);
var camelize = require('camelize');
var snakeize = require('snakeize');
var logger = require('../../config/logger.js');

var login = exports.login = function(cb) {
  magento.core.info(function(err, data) {
    if(err) {
      magento.login(function(err, sessId) {
        if(err) return cb(err);
        return cb(null, sessId);
      });
    }
    else {
      return cb(null, true);
    }
  });
}

exports.catalogList = function(categoryId, res){
  login(function(err) {
    if (err) {
      return res(err);
    }
    magento.catalogCategory.assignedProducts({
      categoryId: categoryId
    }, function (err, resTeams) {
      if(err) return res(err);
      return res(null,camelize(resTeams));
    });
  });
}

//Catalog
exports.catalogProductInfo = function(id, res){
  login(function(err) {
    if(err) return res(err);
    magento.catalogProduct.info({
      id: id
    }, function (err, resinfo) {
      if(err) return res(err);
      return res(null,camelize(resinfo));
    });
  });
}

exports.catalogProductAttributeMediaList = function(id, res){
  login(function(err) {
    if(err) return res(err);
    magento.catalogProductAttributeMedia.list({
      product: id
    }, function (err, resImg) {
      if(err) return res(err);
      return res(null,camelize(resImg));
    });
  });
}

exports.catalogProductCustomOption = function(id, res){
  login(function(err) {
    if(err) return res(err);
    magento.catalogProductCustomOption.list({
      productId: id
    }, function (err, resCustomOption) {
      if(err) return res(err);
      return res(null,camelize(resCustomOption));
    });
  });
}

exports.catalogProductCustomOptionValue = function(id, res){
  login(function(err) {
    if(err) return res(err);
    magento.catalogProductCustomOptionValue.list({
      optionId: id
    }, function (err, resCustomOptionValue) {
      if(err) return res(err);
      return res(null,camelize(resCustomOptionValue));
    });
  });
}

exports.catalogProductLink = function(teamId, res){
  login(function(err) {
    if(err) return res(err);
    magento.catalogProductLink.list({
      product: teamId,
      type:'grouped'
    }, function (err, resProductLink) {
      if(err) return res(err);
      return res(null,camelize(resProductLink));
    });
  });
}

/*
  teamData:
  {
    type:'grouped',//
    set:'9',// should be 9 for Team attibute set.
    sku:'uniqueIDSKU',
    data: {
      name:'name team9',
      websites:['1'],
      short_description:'short_description',
      description:'description',
      status:'1',price:'150',
      tax_class_id:'0',
      url_key:'product-url-key',
      url_path:'url_path',
      visibility:'4',
      categories:['3'],//fire
      categoryIds:['3'],//fire
      balanced_customer_id:'balanced_customer_id1',
      t_d_payment_id:'t_d_customer_id1'
    }
  }
*/
exports.catalogCreate = function(teamData, res){
  login(function(err) {
    if(err) return res(err);
    teamData.data.t_d_payment_id = teamData.data.tdPaymentId || teamData.data.balancedCustomerId;
    magento.catalogProduct.create(snakeize(teamData), function (err, teamId) {
      if(err) return res(err);
      return res(null,camelize(teamId));
    });
  });
}
//end Catalog


//Cart
exports.cartCreate = function(res){
  login(function(err) {
    if (err) return res(err);
    magento.checkoutCart.create(function (err, resCartCreate) {
      if (err) return res(err);
      return res(null, camelize(resCartCreate));
    });
  });
}

exports.cartAdd = function(cartId, productsArray, res){
  //console.log('cartId',cartId);
  //console.log('productsArray',productsArray);
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartProduct.add({
      quoteId: cartId,
      products:  snakeize(productsArray)
    }, function (err, resChkCartProduct) {
      //console.log('err',err);
      //console.log('resChkCartProduct',resChkCartProduct);
      if(err) return res(err);
      return res(null,camelize(resChkCartProduct));
    });
  });
}

exports.cartRemove = function(cartId, productsArray, res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartProduct.remove({
      quoteId: snakeize(cartId),
      productsData: snakeize(productsArray)
    }, function (err, resChkCartProduct) {
      if(err) return res(err);
      return res(null,camelize(resChkCartProduct));
    });
  });
}

exports.cartList = function(cartId,res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartProduct.list({
      quoteId: cartId
    }, function (err, resChkCartProductList) {
      if(err) return res(err);
      return res(null,camelize(resChkCartProductList));
    });
  });
}

exports.cartAddress = function(cartId, customerAddressData,res){
  var addresses = exports.mapMagentoAddresses(customerAddressData);
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartCustomer.addresses({
      quoteId: cartId,
      customerAddressData: addresses
    }, function (err, resChkCartAddress) {
      if(err) return res(err);
      return res(null,camelize(resChkCartAddress));
    });
  });
}

exports.cartCustomer = function(cartId, customer, res){
  var customerData = {customer_id: customer.meta.TDCommerceId, mode:"customer", firstname: customer.firstName, lastname: customer.lastName, email: customer.email};
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartCustomer.set({
      quoteId: cartId,
      customerData: customerData
    }, function (err, resChkCartAddress) {
      if(err) return res(err);
      return res(null,camelize(resChkCartAddress));
    });
  });
}

createCustomer = exports.createCustomer = function(user, cb) {
  // Map to magento
  var gender = 1;
  if(user.gender === 'female') {
    gender = 2;
  }
  login(function(err) {
    if(err) return cb(err);
    magento.customer.create({
      customerData: { firstname: user.firstName, lastname: user.lastName, "email" : user.email, gender: gender}
    }, function(err, data){
      if(err) return cb(err);
      return cb(null, data);
    });
  });
};

createCustomerAddress = exports.createCustomerAddress = function(TDCommerceId, address, cb) {
  var mageAddress = mapMagentoAddress(address);
  login(function(err) {
    if(err) return res(err);
    magento.customerAddress.create({
      customerId: TDCommerceId,
      addressData: mageAddress
    }, function(err, addressId){
      if(err) return cb(err);
      return cb(null, addressId);
    });
  });
};


exports.cartView = function(quoteId,res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCart.info({
      quoteId: quoteId
    }, function (err, resChkCartView) {
      if(err) return res(err);
      return res(null,camelize(resChkCartView));
    });
  });
}

exports.cartTotals = function(quoteId,res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCart.totals({
      quoteId: quoteId
    }, function (err, resChkCartTotals) {
      if(err) return res(err);
      return res(null,camelize(resChkCartTotals));
    });
  });
}
//end Cart

//Checkout
exports.setShipping = function(cartId, shippingMethod, res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartShipping.method({
      quoteId: cartId,
      shippingMethod: shippingMethod
    }, function (err, resSetShipping) {
      if(err) return res(err);
      return res(null,resSetShipping);
    });
  });
}

exports.setPayment = function(cartId, paymentData, res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCartPayment.method({
      quoteId: cartId,
      paymentData: paymentData
    }, function (err, resSetPayment) {
      if(err) return res(err);
      return res(null,camelize(resSetPayment));
    });
  });
}

exports.placeOrder = function(quoteId, res){
  login(function(err) {
    if(err) return res(err);
    magento.checkoutCart.order({
      quoteId: quoteId
    }, function (err, resOrderId) {
      if(err) return res(err);
      return res(null,resOrderId);
    });
  });
}

exports.orderHold = function(orderId, res){
  login(function(err) {
    if(err) return res(err);
    magento.salesOrder.hold({
      orderIncrementId: orderId
    }, function (err, resOrderId) {
      if(err) return res(err);
      return res(null,resOrderId);
    });
  });
}

exports.orderCancel = function(orderId, res){
  login(function(err) {
    if(err) return res(err);
    magento.salesOrder.cancel({
      orderIncrementId: orderId
    }, function (err, resOrderId) {
      if(err) return res(err);
      return res(null,resOrderId);
    });
  });
}

exports.mapMagentoAddresses = function (address){
  arrAddress = [];
  for(var i=0;i<address.length;i++){
    arrAddress.push(mapMagentoAddress(address[i]));
  }
  return arrAddress;
}

mapMagentoAddress = exports.mapMagentoAddress = function (address) {
  var addressObj = {};
  addressObj.mode = address.mode;
  if(address.mode == "billing") {
    addressObj.is_default_billing = true;
  }
  if(address.mode == "shipping") {
    addressObj.is_default_shipping = true;
  }
  if(address.mode == "billing-shipping") {
    addressObj.is_default_billing = true;
    addressObj.is_default_shipping = true;
  }
  addressObj.firstname = address.firstName;
  addressObj.lastname = address.lastName;
  addressObj.street = address.address1;
  if(address.address2) {
    addressObj.street = address.address1 + ' ' + address.address2;
  }
  addressObj.city = address.city;
  addressObj.region = address.state;
  addressObj.postcode = address.zipCode;
  addressObj.country_id = address.country;
  addressObj.telephone = address.telephone;

  return addressObj;
}

exports.addCommentToOrder = function(orderId, comment, status, cb) {
  login(function(err) {
    if (err) {
      return;
    }
    if(! status) {
      status = 'pending'
    }
    magento.salesOrder.addComment({
      orderIncrementId: orderId,
      status: status,
      comment: comment
    }, function (err, res) {
      return cb(err, res);
    });
  });
}

exports.addTransactionToOrder = function(orderId, transactionId, addInfo, cb) {
  login(function(err) {
    if (err) {
      return;
    }
    magento.bighippoSales.createTransaction({
      orderId: orderId,
      transactionId: transactionId,
      addInfo: addInfo
    }, function (err, res) {
      return cb(err, res);
    });
  });
}

exports.updateCartProductPrice = function(cartId, productId, price, cb) {
  login(function(err) {
    if (err) {
      return;
    }
    var data ={
      quoteId: cartId,
      productId: productId,
      price: price
    };
    magento.bighippoCheckout.updateCartProductPrice({
      quoteId: cartId,
      productId: productId,
      price: price
    }, function (err, res) {
      return cb(err, res);
    });
  });
}

exports.orderLoad = function(orderId, cb) {
  login(function(err) {
    if (err) {
      logger.info(err, err);
      return cb(err);
    }
    magento.salesOrder.info({
      orderIncrementId: orderId
    }, function (err, res) {
      if(err) return cb(err);
      var orderDetails = mapOrder(res);
      return cb(null, orderDetails);
    });
  });
}

exports.orderList = function(filters, cb) {
  var orders = [];
  login(function(err) {
    if (err) {
      logger.info(err, err);
      return cb(err);
    }
    //console.log('orderList 4');
    magento.salesOrder.list({
      filters : filters
    }, function (err, res) {
      if(err) return cb(err);
      for(var orderIndex in res) {
        var order = res[orderIndex];
        orders.push(mapOrder(order));
      }
      return cb(null, orders);
    });
  });
}

exports.transactionList = function(orderId, cb) {
  login(function(err) {
    if(err) return res(err);
    magento.bighippoSales.listTransactions({
      orderId: orderId
    }, function (err, data) {
      if(err) return cb(err);
      return cb(null,camelize(data));
    });
  });
}

function mapOrder(magentoOrder) {
  //console.log('magentoOrder',magentoOrder);
  var orderDetails = {};
  orderDetails.incrementId = magentoOrder.increment_id;
  orderDetails.status = magentoOrder.status;
  orderDetails.grandTotal = magentoOrder.grand_total;
  orderDetails.retry = []
  if(magentoOrder.items) {
    orderDetails.sku = magentoOrder.items[0].sku;
    orderDetails.productId = magentoOrder.items[0].product_id;
  }
  for(var commentId in magentoOrder.status_history) {
    try {
      if(magentoOrder.status_history[commentId]) {
        var comment = magentoOrder.status_history[commentId].comment;
        var json = JSON.parse(comment);
        if(json.userId) {
          orderDetails.userId = json.userId;
          orderDetails.paymentMethod = json.paymentMethod;
          orderDetails.payment = json.payment;
          orderDetails.athleteId = json.athleteId;
          orderDetails.products = json.products;
          orderDetails.createdAt = magentoOrder.status_history[commentId].created_at;
          if (json.cardId) {
            orderDetails.cardId = json.cardId;
          }
        };
        if(json.meta){
          orderDetails.meta = json.meta
        }
        if(json.schedulePeriods) {
          orderDetails.schedulePeriods = json.schedulePeriods;
        }
        if(json.retryId) {
          orderDetails.retry.push(json);
        }
      }
    } catch (e) {
    }
  }
  //console.log('orderDetails',orderDetails);
  return orderDetails;
}

