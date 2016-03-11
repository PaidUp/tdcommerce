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
  couponModel.update(req.body.filter, {'$set':req.body.data}, function(err, coupon){
    if (err) return res.status(400).json({err:err})
    return res.status(200).json(coupon)
  })
}

exports.redeem = function(req, res){
  //filter = coupon exista - idPorduct= idproct - rango de fechas. y que quantity >0
  //query = desc -1 quantity
  console.log('req.body', req.body);
  let filter = {
    code : req.body.coupon,
    productsId: req.body.productId
  };
  console.log('filter', filter)
  couponModel.update(filter, {'$inc':{quantity:-1}}, function(err, couponUpd){
    if (err) return res.status(400).json({err:err})
    console.log('couponUpd', couponUpd)
    couponModel.findOne(filter, function(err, coupon){
      if (err) return res.status(400).json({err:err})
      console.log('err', err)
      console.log('coupon', coupon)
      return res.status(200).json(coupon)
    })
  })
}