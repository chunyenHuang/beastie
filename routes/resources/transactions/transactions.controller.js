const PrinterController = require('../printer/printer.controller.js');
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
            total: null,
            isTaxIncluded: false,
            paymentTransactionsNumber: null,
            note: null,
            isVoidedAt: null,
            createdAt: null
        };
        res.send(template);
    }

    checkout(req, res) {
        Object.assign(req.body, {
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.insert(req.body,
            (err, docsInserted) => {
                console.log(docsInserted.ops[0]);
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
                        this._parCredit(req, res);
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
        req.params.id = req.body.order_id;
        req.collection = req.db.collection('orders');
        req.collection.update({
            _id: req.body.order_id
        }, {
            $set: {
                isPaid: true,
                checkOutAt: new Date()
            }
        }, (err) => {
            if (!err) {
                req.lookup = {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'order_id',
                    as: 'transactions'
                };
                this._printReceipt(req, res, () => {
                    this.get(req, res);
                    return;
                });
            } else {
                res.sendStatus(400);
            }
        });
    }

    _paySelfService(req, res) {
        req.params.id = req.body.selfService_id;
        req.collection = req.db.collection('selfServices');
        req.collection.update({
            _id: req.body.selfService_id
        }, {
            $set: {
                isPaid: true,
                checkOutAt: new Date()
            }
        }, (err) => {
            if (!err) {
                req.lookup = {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'selfService_id',
                    as: 'transactions'
                };
                this._printReceipt(req, res, () => {
                    this.get(req, res);
                    return;
                });
            } else {
                res.sendStatus(400);
            }
        });
    }

    _parCredit(req, res) {
        req.params.id = req.body.credit_id;
        req.collection = req.db.collection('credits');
        req.collection.update({
            _id: req.body.credit_id
                // customer_id: req.params.customer_id
        }, {
            $inc: {
                balance: -parseFloat(req.body.total)
                    // credit: parseFloat(req.body.total)
            }
        }, (err) => {
            if (!err) {
                req.lookup = {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'credit_id',
                    as: 'transactions'
                };
                req.params.id = req.params.transaction_id || req.params.id;
                this._printReceipt(req, res, () => {
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
        if (!this.device) {
            res.send({
                message: 'printer is not connected.'
            });
            return;
        }
        req.collection = req.db.collection('transactions');
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
                    from: 'selfServicesPackages',
                    localField: 'selfServicePackage_id',
                    foreignField: '_id',
                    as: 'selfServicesPackages'
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
            const tax = 0.09;
            const today = new Date();
            const transaction = results[0];
            const price = (number) => {
                number = parseFloat(number).toFixed(2);
                number = '$' + number;
                return number;
            };
            /*
                4141 S. Nogales St. B105
                West Covina, CA 91792
            */

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
                    .text(price(transaction.total))
                    .align('lt')
                    .text('Tax')
                    .align('rt')
                    .text(price(transaction.total * tax))
                    .align('lt')
                    .text('Total')
                    .align('rt')
                    .text(price(transaction.total * (1 + tax)))
                    // .text(' ')
                    // .align('lt')
                    // .text('Paid')
                    // .align('rt')
                    // .text(price(transaction.total * (1 + tax)))
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
                next();
                // res.sendStatus(200);
            });
        });

    }
}

module.exports = TransactionsController;
