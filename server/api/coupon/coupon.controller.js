'use strict';

let couponModel = require('./coupon.model').couponModel

exports.create = function(req, res){
  couponModel.create(req.body, function(err, order){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json({order:order})
  })
}

exports.list = function(req, res){
  couponModel.find(req.body, function(err, orders){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json({orders:orders})
  })
}

exports.update = function(req, res){
  //TODO see address.controller.
  couponModel.update(req.body.filter, {'$set':req.body.data}, function(err, orders){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json({orders:orders})
  })
}