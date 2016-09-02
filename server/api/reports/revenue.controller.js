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

        { $sort: { '_id.year': 1, '_id.month': 1 } }

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

exports.retrieve = function (req, res) {
    let match = [{ 'paymentsPlan.status': "succeeded" }];
    aggregate(match, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(data);
    });
}
