const PrinterController = require('../printer/printer.controller.js');
const ObjectId = require('mongodb').ObjectID;
class TransactionsController extends PrinterController {
    constructor() {
        super();
        this.get = this.get.bind(this);
        this._payOrder = this._payOrder.bind(this);
        this._printReceipt = this._printReceipt.bind(this);
    }
    getTemplate(req, res) {
        const template = {
            credit_id: null,
            selfService_id: null,
            order_id: null,
            customer_id: null,
            isPaidByStoreCredit: false,
            total: null,
            isTaxIncluded: false,
            paymentTransactionsNumber: null,
            note: null,
            isVoidedAt: null,
            createdAt: null
        };
        res.send(template);
    }

    updateInfo(req, res) {
        Object.assign(req.body, {
            updatedAt: new Date(),
            updatedBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });
        if (req.body._id) {
            delete req.body._id;
        }
        const info = {
            note: req.body.note,
            paymentTransactionsNumber: req.body.paymentTransactionsNumber
        };
        req.collection.update({
            _id: ObjectId(req.params.id)
        }, {
            $set: info
        }, {
            upsert: true
        }, (err, result) => {
            if (!err) {
                res.statusCode = 204;
                res.json(result);
            } else {
                res.sendStatus(500);
            }
        });
    }

    checkout(req, res) {
        Object.assign(req.body, {
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });
        console.log('-----');
        console.log(req.body);
        req.collection.insert(req.body,
            (err, docsInserted) => {
                req.params.transaction_id = docsInserted.ops[0]._id;
                if (!err) {
                    if (req.body.order_id) {
                        this._payOrder(req, res);
                        return;
                    }
                    if (req.body.selfService_id) {
                        this._paySelfService(req, res);
                        return;
                    }
                    if (req.body.credit_id) {
                        this._payCredit(req, res);
                        return;
                    }
                    res.statusCode = 201;
                    res.send();
                } else {
                    console.log(err);
                    res.send({
                        message: 'fail to checkout'
                    });
                }
            });
    }

    _payOrder(req, res) {
        req.collection = req.db.collection('orders');
        req.collection.update({
            _id: req.body.order_id,
            isDeleted: false
        }, {
            $set: {
                isPaid: true,
                checkOutAt: new Date()
            }
        }, (err) => {
            if (!err) {
                this._printReceipt(req, res, () => {
                    req.collection = req.db.collection('orders');
                    req.params.id = req.body.order_id;
                    req.lookup = {
                        from: 'transactions',
                        localField: '_id',
                        foreignField: 'order_id',
                        as: 'transactions'
                    };
                    this.get(req, res);
                    return;
                });
            } else {
                res.sendStatus(400);
            }
        });
    }

    _paySelfService(req, res) {
        req.collection = req.db.collection('selfServices');
        req.collection.update({
            _id: req.body.selfService_id,
            isDeleted: false
        }, {
            $set: {
                isPaid: true,
                checkOutAt: new Date()
            }
        }, (err) => {
            if (!err) {
                this._updatePaidByStoreCredit(req, res, () => {
                    this._printReceipt(req, res, () => {
                        req.collection = req.db.collection('selfServices');
                        req.params.id = req.body.selfService_id;
                        req.lookup = {
                            from: 'transactions',
                            localField: '_id',
                            foreignField: 'selfService_id',
                            as: 'transactions'
                        };
                        this.get(req, res);
                        return;
                    });
                });
            } else {
                res.sendStatus(400);
            }
        });
    }

    _updatePaidByStoreCredit(req, res, next) {
        console.log(req.body.isPaidByStoreCredit);
        if (!req.body.isPaidByStoreCredit) {
            next();
        }
        req.collection = req.db.collection('credits');
        req.collection.update({
            customer_id: ObjectId(req.body.customer_id)
        }, {
            $inc: {
                credit: -parseFloat(req.body.total)
            },
            $push: {
                creditUsed: {
                    service: req.body.selfService_id || req.body.order_id,
                    credit: parseFloat(req.body.total),
                    createdAt: new Date()
                }
            }
        }, () => {
            next();
        });
    }

    _payCredit(req, res) {
        req.collection = req.db.collection('credits');
        req.collection.update({
            _id: req.body.credit_id,
            isDeleted: false
                // customer_id: req.params.customer_id
        }, {
            $inc: {
                balance: -parseFloat(req.body.total)
                    // credit: parseFloat(req.body.total)
            }
        }, (err) => {
            if (!err) {
                this._printReceipt(req, res, () => {
                    req.params.id = req.body.credit_id;
                    req.collection = req.db.collection('credits');
                    req.lookup = {
                        from: 'transactions',
                        localField: '_id',
                        foreignField: 'credit_id',
                        as: 'transactions'
                    };
                    this.get(req, res);
                    return;
                });
            } else {
                res.sendStatus(400);
            }
        });
    }

    get(req, res) {
        req.lookup = req.lookup || {};
        const query = req.collection.aggregate([
            {
                $match: {
                    _id: req.params.id,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'customers'
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order_id',
                    foreignField: '_id',
                    as: 'orders'
                }
            },
            {
                $lookup: req.lookup
            }
        ]);

        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results[0]);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }
    validateRequest(req, res, next) {
        if (!req.body.customer_id) {
            res.json({
                message: 'no customer_id'
            });
            return;
        }
        if (!req.body.order_id &&
            !req.body.selfService_id &&
            !req.body.credit_id
        ) {
            res.json({
                message: 'no order_id or selfService_id or credit_id'
            });
            return;
        }
        if (!req.body.total) {
            res.json({
                message: 'no total'
            });
            return;
        }
        req.body.total = parseFloat(req.body.total);
        if (isNaN(req.body.total)) {
            res.json({
                message: 'total is not number.'
            });
            return;
        } else if (req.body.total === 0) {
            res.json({
                message: 'total is 0.'
            });
            return;
        }

        req.body.isTaxIncluded = req.body.isTaxIncluded || false;
        req.body.paymentTransactionsNumber = req.body.paymentTransactionsNumber || null;
        next();
    }

    _printReceipt(req, res, next) {
        req.collection = req.db.collection('transactions');
        if (!this.device) {
            console.log('printer is not connected');
            next();
            return;
        }
        const query = req.collection.aggregate([
            {
                $match: {
                    _id: req.params.transaction_id || req.params.id
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'customers'
                }
            }, {
                $lookup: {
                    from: 'credits',
                    localField: 'credit_id',
                    foreignField: '_id',
                    as: 'credits'
                }
            }, {
                $lookup: {
                    from: 'selfServices',
                    localField: 'selfService_id',
                    foreignField: '_id',
                    as: 'selfServices'
                }
            }, {
                $lookup: {
                    from: 'orders',
                    localField: 'order_id',
                    foreignField: '_id',
                    as: 'orders'
                }
            }
        ]);

        query.toArray((err, results) => {
            if (err) {
                res.statusCode = 500;
                res.send({
                    message: 'db error'
                });
                return;
            }
            if (results.length === 0) {
                res.statusCode = 500;
                res.send({
                    message: 'no transactions'
                });
                return;
            }
            const transaction = results[0];

            const tax = 0.09;
            const today = new Date();
            const price = (input) => {
                let number = input;
                number = parseFloat(number).toFixed(2);
                number = '$' + number;
                return number;
            };
            let subtotal,
                taxAmount,
                total,
                credit;

            if (transaction.isTaxIncluded) {
                subtotal = price(transaction.total / (1 + tax));
                taxAmount = price(transaction.total / (1 + tax) * tax);
                total = price(transaction.total);
            } else {
                subtotal = price(transaction.total);
                // taxAmount = price(transaction.total * tax);
                taxAmount = price(0);
                total = price(transaction.total);
            }
            // console.log(transaction);
            if (transaction.customers.length === 0) {
                transaction.customers[0] = {
                    firstname: '',
                    lastname: ''
                };
            }

            if(req.body.isPaidByStoreCredit){
                credit = '-' + total;
                total = price(0);
            }

            this.device.open(() => {
                this.printer
                    .font('A')
                    .align('ct')
                    .style('b')
                    .size(1, 1)
                    .text(' ')
                    .text('A+ Pet Grooming')
                    .text('4141 S. Nogales St. B105')
                    .text('West Covina, CA 91792')
                    .align('lt')
                    .text(' ')
                    .text(' ')
                    .text('transaction # ' + transaction._id)
                    .text(' ')
                    .text('customer      ' + transaction.customers[0].firstname +
                        ' ' + transaction.customers[0].lastname)
                    .text(' ')
                    .text(' ')

                    .align('lt')
                    .text('Grooming service')
                    .align('rt')
                    .text(subtotal)

                    .align('lt')
                    .text('Tax')
                    .align('rt')
                    .text(taxAmount)

                    .align('lt')
                    .text('Store Credit')
                    .align('rt')
                    .text(credit)

                    .align('lt')
                    .text('Total')
                    .align('rt')
                    .text(total)

                    .text(' ')
                    .align('ct')
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .text(today.toLocaleDateString())
                    .text(today.toLocaleTimeString())
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .cut();


                // .text(req.body.order_id)
                // .text('中文測試到底可不可以', 'Big5')
                // .barcode(barcode, 'EAN13')
                // .image(image, 's8')
                // .image(image, 'd8')
                // .image(image, 's24')
                // .image(image, 'd24')
                // .raster(image, 'dw')
                // .raster(image, 'dh')
                // .raster(image, 'dwdh')
                // .qrimage('https://github.com/song940/node-escpos', function(err){
                //   this.cut();
                // });
                req.params.id = req.params.transaction_id || req.params.id;
                next();
                // res.sendStatus(200);
            });
        });

    }
}

module.exports = TransactionsController;
