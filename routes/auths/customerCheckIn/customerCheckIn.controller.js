const AbstractController = require('../../abstract/AbstractController.js');
const OrdersController = require('../../resources/orders/orders.controller.js');
const Orders = new OrdersController;

class CustomerCheckInController extends AbstractController {
    constructor(){
        super();
        this.checkIn = this.checkIn.bind(this);
    }
    _findCustomer(req, res, next){
        const query = req.collection.find({
            phone: req.params.phone
        });
        query.toArray((err, results) => {
            if (err || results.length === 0) {
                res.statusCode = 500;
                res.send('Can not find Customer');
            } else {
                req.customer = results[0];
                next();
            }
        });
    }

    _updateCustomerLastLoginAt(req, res, next){
        req.collection.update({
            id: req.customer._id
        }, {
            $set: {
                lastLoginAt: new Date()
            }
        }, (err) => {
            if (err) {
                res.statusCode = 500;
                res.send('Can not update Customer lastLoginAt');
            } else {
                next();
            }
        });
    }

    _getTodayNextNumber(req, res, next){
        Orders._setFromTo(req, res, ()=>{
            req.collection = req.db.collection('orders');
            Orders._getByDate(req, res, (results)=>{
                if(results.length===0){
                    res.statusCode = 500;
                    res.send('Can not find any orders for today.');
                } else {
                    next(results);
                }
            });
        });
    }

    checkIn(req, res) {
        req.today = new Date();
        this._findCustomer(req, res, ()=>{
            this._updateCustomerLastLoginAt(req, res, ()=>{
                this._getTodayNextNumber(req, res, (todayOrders)=>{
                    let currentCheckInNumber = 0;
                    let order;
                    for (var i = 0; i < todayOrders.length; i++) {
                        if(todayOrders[i].checkInNumber){
                            if(todayOrders[i].checkInNumber > currentCheckInNumber){
                                currentCheckInNumber = todayOrders[i].checkInNumber;
                            }
                        }
                        if(todayOrders[i].customer_id.toString() == req.customer._id.toString()){
                            order = todayOrders[i];
                        }
                    }
                    const checkInNumber = (currentCheckInNumber + 1);

                    req.db.collection('orders').update({
                        _id: order._id,
                        checkInAt: null,
                        checkInNumber: null
                    }, {
                        $set: {
                            checkInAt: req.today,
                            checkInNumber: checkInNumber
                        }
                    }, (err, results)=>{
                        if(results.result.nModified != 0){
                            res.statusCode = 200;
                            res.json({
                                order_id: order._id,
                                customer_id: req.customer._id,
                                checkInAt: req.today,
                                checkInNumber: checkInNumber
                            });
                        } else {
                            res.statusCode = 500;
                            res.json({
                                order_id: order._id,
                                customer_id: req.customer._id,
                                checkInAt: order.checkInAt,
                                checkInNumber: order.checkInNumber
                            });
                        }
                    });
                })
            });
        });
    }
}

module.exports = CustomerCheckInController;
