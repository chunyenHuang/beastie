const AbstractController = require('../../abstract/AbstractController.js');
const OrdersController = require('../../resources/orders/orders.controller.js');
const Orders = new OrdersController;

class CustomerCheckInController extends AbstractController {
    constructor() {
        super();
        this.checkIn = this.checkIn.bind(this);
    }
    _findCustomer(req, res, next) {
        const query = req.collection.find({
            phone: req.params.phone
        });
        query.toArray((err, results) => {
            if (err || results.length === 0) {
                res.statusCode = 400;
                res.send('Can not find Customer');
            } else {
                req.customer = results[0];
                next();
            }
        });
    }

    _updateCustomerLastLoginAt(req, res, next) {
        req.collection.update({
            id: req.customer._id
        }, {
            $set: {
                lastLoginAt: new Date()
            }
        }, (err) => {
            if (err) {
                res.statusCode = 500;
                res.send({
                    customer_id: req.customer._id,
                    message: 'Can not update Customer lastLoginAt'
                });
            } else {
                next();
            }
        });
    }

    _getTodayNextNumber(req, res, next) {
        Orders._setFromTo(req, res, () => {
            req.collection = req.db.collection('orders');
            Orders._getByDate(req, res, (results) => {
                if (results.length === 0) {
                    res.statusCode = 500;
                    res.send({
                        customer_id: req.customer._id,
                        message: 'Can not find any orders for today'
                    });
                } else {
                    next(results);
                }
            });
        });
    }

    checkIn(req, res) {
        req.today = new Date();
        this._findCustomer(req, res, () => {
            this._updateCustomerLastLoginAt(req, res, () => {
                this._getTodayNextNumber(req, res, (todayOrders) => {
                    let currentCheckInNumber = 0;
                    const orders = [];
                    for (var i = 0; i < todayOrders.length; i++) {
                        if (todayOrders[i].checkInNumber) {
                            if (todayOrders[i].checkInNumber > currentCheckInNumber) {
                                currentCheckInNumber = todayOrders[i].checkInNumber;
                            }
                        } else if (
                            (todayOrders[i].customer_id.toString() == req.customer._id.toString())
                        ) {
                            orders.push(todayOrders[i]);
                        }
                    }
                    if (orders.length === 0) {
                        res.statusCode = 200;
                        res.json(req.customer);
                        return;
                    }
                    let checkInNumber = (currentCheckInNumber + 1);


                    let responses = 0;
                    orders.forEach((order) => {
                        order.checkInAt = req.today;
                        order.checkInNumber = checkInNumber;
                        checkInNumber++;
                        console.log(order._id);
                        console.log(order.checkInNumber);

                        req.db.collection('orders').update({
                            _id: order._id,
                            checkInAt: null,
                            checkInNumber: null
                        }, {
                            $set: {
                                checkInAt: req.today,
                                checkInNumber: order.checkInNumber
                            }
                        }, () => {
                            responses++;
                            if (responses == orders.length) {
                                const io = req.app.get('socket-io');
                                io.sockets.emit('customerCheckIn', orders);
                                res.statusCode = 200;
                                res.json(orders);
                            }
                        });
                    });
                });
            });
        });
    }
}

module.exports = CustomerCheckInController;
