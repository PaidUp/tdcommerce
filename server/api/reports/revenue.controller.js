'use strict'

let orderModel = require('../order/order.model').orderModel

exports.projections = function (req, res) {
    orderModel.aggregate([
        { $unwind: "$paymentsPlan" },
        { $match: { $or: [{ 'paymentsPlan.status': "failed" }, { 'paymentsPlan.status': "pending" }, { 'paymentsPlan.status': "processing" }] } },
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
            return res.status(500).json(err);
        }
        res.status(200).json({data: result});
    });
}
