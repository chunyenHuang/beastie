const AbstractController = require('../../abstract/AbstractController.js');
// const ObjectId = require('mongodb').ObjectID;

class CustomerCheckInController extends AbstractController {
    checkIn(req, res) {
        let customer;
        const query = req.collection.find({
            phone: req.params.phone
        });
        query.toArray((err, results) => {
            if (err || results.length === 0) {
                res.statusCode = 500;
                res.send('Can not find Customer');
            } else {
                customer = results[0];
                req.collection.update({
                    phone: req.params.phone
                }, {
                    $set: {
                        lastLoginAt: new Date()
                    }
                }, (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.send('Can not update Customer lastLoginAt');
                    } else {
                        req.db.collection('orders').update({
                            customer_id: (customer._id).toString(),
                            checkInAt: null,
                            isCanceled: false,
                            notShowup: false
                        }, {
                            $set: {
                                checkInAt: new Date()
                            }
                        }, ()=>{
                            res.statusCode = 200;
                            res.json({
                                _id: customer._id
                            });
                            //
                            // if (err) {
                            //     res.statusCode = 500;
                            //     res.send('Can not update Order checkInAt');
                            //     res.statusCode = 200;
                            //     res.json({
                            //         _id: customer._id
                            //     });
                            //
                            // } else {
                            //     res.statusCode = 200;
                            //     res.json({
                            //         _id: customer._id
                            //     });
                            // }
                        });
                    }
                });
            }
        });
    }
}

module.exports = CustomerCheckInController;
