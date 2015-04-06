'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9002,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'tdcommerce-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // Commerce settings
  commerce: {
    adapter: path.normalize(__dirname + '/../../..') + '/server/api/adapters/magento.adapter',
    magento: {
      host: 'develop.convenienceselect.com',
      port: 8888,
      path: '/api/xmlrpc/',
      login: 'magento',
      pass: 'Sv38SJVR'
    },
    category: {
      teams: 3,
      merchandise: 4
    },
    products: {
      fee: {
        id: 9,
        sku: "fee"
      },
      interest: {
        id: 10,
        sku: "interest"
      }
    },
    testing: {
      teamId: 2
    },
    defaultAddress:
      [
        {
          mode: "billing",
          firstName: "Customer First Name",
          lastName: "Customer Last Name",
          address1: "801 east 11th st",
          address2: "801 east 11th st",
          city: "Austin",
          state: "TX",
          zipCode: "78702",
          country: "US",
          telephone: "+1 320123245"
        },
        {
          mode: "shipping",
          firstName: "Customer First Name",
          lastName: "Customer Last Name",
          address1: "801 east 11th st",
          address2: "801 east 11th st",
          city: "Austin",
          state: "TX",
          zipCode: "78702",
          country: "US",
          telephone: "+1 320123245"
        }
      ],
    shippingMethod: 'freeshipping_freeshipping',
    paymentMethod: 'purchaseorder'
  },
  nodePass: {
    me:{
      token : 'TDCommerceToken-CHANGE-ME!'
    }
  }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
