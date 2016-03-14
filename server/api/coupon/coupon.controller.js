'use strict';

let couponModel = require('./coupon.model').couponModel

exports.create = function(req, res){
  couponModel.create(req.body, function(err, coupon){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json({coupon:coupon})
  })
}

exports.list = function(req, res){
  couponModel.find(req.body, function(err, coupons){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json({coupons:coupons})
  })
}

exports.update = function(req, res){
  //TODO see address.controller.
  couponModel.update(req.body.filter, {'$set':req.body.data}, {runValidators: true}, function(err, coupon){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json(coupon)
  })
}

exports.redeem = function(req, res){
  let now = new Date()
  let filter = {
    code : req.body.coupon,
    productsId: req.body.productId,
    startDate : {'$lte': now},
    endDate : {'$gte': now}
  };

  couponModel.findOne(filter, function(err, coupon){
    if (err) return res.status(400).json({err:err})
    if(!coupon || coupon.quantity <= 0){
      return res.status(400).json({statusCode:'notAvailable', message:'this coupon is not available'})
    }
    couponModel.update(filter, {'$inc':{quantity:-1}}, {runValidators: true}, function(err, couponUpd){
      if (err) return res.status(400).json({err:err})
      return res.status(200).json({_id: coupon._id, percent: coupon.percent})
    })
  })
}