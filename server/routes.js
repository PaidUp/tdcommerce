/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/v1/commerce', require('./api'));
  app.use('/api/v2/commerce/catalog', require('./api/catalog/index2'));
  app.use('/api/v2/commerce/order', require('./api/order/index2'));
  app.use('/api/v3/commerce/order', require('./api/order/index3'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.get('/swagger.json', function(req,res){
    return res.download(__dirname + '/swagger.json', 'swagger.json');
  });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.status(200).json({'node':'Commerce!!!'});
    });
};
