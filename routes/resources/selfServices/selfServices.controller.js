const PrinterController = require('../printer/printer.controller.js');
class SelfServicesController extends PrinterController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            package: null,
            service: null,
            addon: [],
            total: null,
            isPaid: null,
            isDeleted: false
        };
        res.send(template);
    }

    get(req, res) {
        const query = req.collection.find({
            customer_id: req.params.customer_id,
            isDeleted: false
        });
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

    post(req, res) {
        Object.assign(req.body, {
            isPaid: false,
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                const io = req.app.get('socket-io');
                io.sockets.emit('selfServicesPurchase', {
                    message: 'A new purchase is created, please check and confirm.'
                });
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                res.sendStatus(500);
            }
        });
    }

    printTicket(req, res) {
        // only print when ticket is correct
        const query = req.collection.aggregate([
            {
                $match: {
                    _id: req.params.customer_id,
                    isPaid: true,
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
            }
        ]);

        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    req.selfServiceTicket = results[0];
                    this._print(req, res, () => {
                        const io = req.app.get('socket-io');
                        io.sockets.emit('selfServicesNewTicket', {
                            message: 'A new ticket for self service is printed.'
                        });
                        res.sendStatus(200);
                    });
                    // res.statusCode = 200;
                    // res.json(results[0]);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }
    _print(req, res, next) {
        if (!this.device) {
            next();
            return;
        }
        console.log(req.selfServiceTicket);
        this.device.open(() => {
            const today = new Date();
            this.printer
                .font('A')
                .align('ct')
                .style('b')
                .size(2, 4)
                .text(' ')
                .text('A+ Pet Grooming')
                .text('------------------------')
                .text('      Self Service      ')
                .text('------------------------')
                .text('------------------------')
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
        });
    }


    /*
        for packages
    */

    login(req, res) {
        if (!req.body.pinPasswords) {
            res.sendStatus(400);
            return;
        }
        const query = req.collection.find({
            customer_id: req.params.customer_id,
            isDeleted: false
        });
        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    if(results[0].pinPasswords == req.body.pinPasswords){
                        res.statusCode = 200;
                        res.json(results[0]);
                    } else {
                        res.statusCode = 403;
                        res.json({
                            message: 'wrong pin'
                        });
                    }
                } else {
                    this._createNewPinPasswords(req, res);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }

    _createNewPinPasswords(req, res) {
        req.collection.insert({
            customer_id: req.params.customer_id,
            pinPasswords: req.body.pinPasswords,
            purchased: [],
            // used: [],
            transactions: [],
            balance: 0,
            credit: 0,
            isDeleted: false
        }, (err, docsInserted) => {
            if (!err) {
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                res.sendStatus(500);
            }
        });
    }

    purchase(req, res) {
        if (!req.body.package) {
            res.json({
                message: 'no package'
            });
            return;
        }
        if (!req.body.package.total) {
            res.json({
                message: 'no total'
            });
            return;
        }
        if (!req.body.package.credit) {
            res.json({
                message: 'no credit'
            });
            return;
        }
        if (isNaN(parseFloat(req.body.package.total))) {
            res.json({
                message: 'total is not number'
            });
            return;
        }
        if (isNaN(parseFloat(req.body.package.credit))) {
            res.json({
                message: 'credit is not number'
            });
            return;
        }
        req.collection.update({
            customer_id: req.params.customer_id
        }, {
            $push: {
                purchased: req.body.package,
                transactions: {
                    addBalance: parseFloat(req.body.package.total),
                    addCredit: parseFloat(req.body.package.credit),
                    createdAt: new Date()
                }
            },
            $inc: {
                balance: parseFloat(req.body.package.total),
                credit: parseFloat(req.body.package.credit)
            }
        }, (err) => {
            if (!err) {
                res.statusCode = 201;
                this.get(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }

    payBalance(req, res) {
        if (isNaN(parseFloat(req.body.paid))) {
            res.json({
                message: 'paid is not number'
            });
            return;
        }
        if (parseFloat(req.body.paid) <= 0) {
            res.json({
                message: 'paid has more than 0'
            });
            return;
        }
        req.collection.update({
            customer_id: req.params.customer_id
        }, {
            $inc: {
                balance: -parseFloat(req.body.paid)
            },
            $push: {
                transactions: {
                    payBalance: parseFloat(req.body.paid),
                    createdAt: new Date()
                }
            }
        }, (err) => {
            if (!err) {
                res.statusCode = 201;
                this.get(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }

    useCredit(req, res) {
        if (isNaN(parseFloat(req.body.useCredit))) {
            res.json({
                message: 'useCredit is not number'
            });
            return;
        }
        if (parseFloat(req.body.useCredit) <= 0) {
            res.json({
                message: 'useCredit has more than 0'
            });
            return;
        }
        req.collection.update({
            customer_id: req.params.customer_id
        }, {
            $inc: {
                credit: -parseFloat(req.body.useCredit)
            },
            $push: {
                transactions: {
                    useCredit: parseFloat(req.body.useCredit),
                    createdAt: new Date()
                }
            }
        }, (err) => {
            if (!err) {
                res.statusCode = 201;
                this.get(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }
}

module.exports = SelfServicesController;
