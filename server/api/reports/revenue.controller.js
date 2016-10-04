'use strict'

let orderModel = require('../order/order.model').orderModel

function aggregate(match, cb) {
    orderModel.aggregate([
        { $unwind: "$paymentsPlan" },
        { $match: { $or: match } },
        {
            $group: {
                _id: {
                    organizationName: "$paymentsPlan.productInfo.organizationName",
                    organizationId: "$paymentsPlan.productInfo.organizationId",
                    organizationLocation: "$paymentsPlan.productInfo.organizationLocation",
                    month: { $month: '$paymentsPlan.dateCharge' },
                    year: { $year: '$paymentsPlan.dateCharge' }
                },


                paidupFee: { $sum: "$paymentsPlan.feePaidUp" },
                stripeFee: { $sum: "$paymentsPlan.feeStripe" },
                totalFee: { $sum: "$paymentsPlan.totalFee" },
                price: { $sum: "$paymentsPlan.price" }
            }
        },

        {
            $project: {
                _id: 1,
                value: {
                    paidupFee: '$paidupFee',
                    stripeFee: '$stripeFee',
                    totalFee: '$totalFee',
                    price: '$price'
                }
            }
        },

        { $sort: { '_id.year': 1, '_id.month': 1, '_id.organizationName': 1 } }



    ], function (err, result) {
            if (err) {
                cb(err);
            }
            cb(null, { data: result });
        });
}

exports.projections = function (req, res) {
    let match = [{ 'paymentsPlan.status': "failed" }, { 'paymentsPlan.status': "pending" }, { 'paymentsPlan.status': "processing" }];
    aggregate(match, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(data);
    });
}

exports.revenue = function (req, res) {

    var o = {};
    o.map = function () {
        this.paymentsPlan.map(function (data) {
            if (data.status === 'succeeded' || data.status === 'refunded') {
                data.attempts.map(function (attemp) {
                    var _id = {
                        year: attemp.dateAttemp.getFullYear(),                        
                        month: attemp.dateAttemp.getMonth() + 1,
                        organizationId: data.productInfo.organizationId,
                        organizationName: data.productInfo.organizationName,
                        organizationLocation: data.productInfo.organizationLocation
                    }

                    var res = {
                        price: data.status === 'succeeded' ? data.price : data.price * -1,
                        stripeFee: data.status === 'succeeded' ? data.feeStripe : data.feeStripe * -1,
                        paidupFee: data.status === 'succeeded' ? data.feePaidUp : data.feePaidUp * -1,
                        totalFee: data.status === 'succeeded' ? data.totalFee : data.totalFee * -1,
                    };
                    emit(_id, res);
                });
            }
        })
    };



    o.reduce = function (id, data) {
        var reduceVal = {
            price: 0,
            stripeFee: 0,
            paidupFee: 0,
            totalFee: 0,
        }
        for (var idx = 0; idx < data.length; idx++) {
            reduceVal.price = reduceVal.price + data[idx].price
            reduceVal.stripeFee = reduceVal.stripeFee + data[idx].stripeFee
            reduceVal.paidupFee = reduceVal.paidupFee + data[idx].paidupFee
            reduceVal.totalFee = reduceVal.totalFee + data[idx].totalFee
        }
        return reduceVal;
    };

    orderModel.mapReduce(o, function (err, data) {
        console.log(data)
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ data: data });
    })
}