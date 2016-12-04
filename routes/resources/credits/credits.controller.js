const AbstractController = require('../../abstract/AbstractController.js');
class creditsController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: req.params.customer_id,
            pinPasswords: req.body.pinPasswords,
            purchased: [
                /* {
                     name: null,
                     total: null,
                     credit: null
                 }*/
            ],
            // used: [],
            balance: 0,
            credit: 0,
            creditUsed: [],
            isDeleted: false

        };
        res.send(template);
    }

    login(req, res) {
        if (!req.body.pinPasswords) {
            res.json({
                message: 'no pinPasswords'
            });
            return;
        }
        if (req.body.pinPasswords.length != 6) {
            res.json({
                message: 'pinPasswords is not 6 digits'
            });
            return;
        }
        if (isNaN(parseInt(req.body.pinPasswords))) {
            res.json({
                message: 'pinPasswords is not numbers'
            });
            return;
        }

        const query = req.collection.find({
            customer_id: req.params.customer_id,
            isDeleted: false
        });
        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    if (results[0].pinPasswords == req.body.pinPasswords) {
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
            balance: 0,
            credit: 0,
            creditUsed: [],
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

    getCredits(req, res) {
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

    purchase(req, res) {
        // for ex: total 90 and credit 100 (10 %off)
        if (!req.body.package) {
            res.json({
                message: 'no package'
            });
            return;
        }
        if (!req.body.package.total) {
            res.json({
                message: 'no package.total'
            });
            return;
        }
        if (isNaN(parseFloat(req.body.package.total))) {
            res.json({
                message: 'package.total is not number'
            });
            return;
        }
        if (!req.body.package.credit) {
            res.json({
                message: 'no package.credit'
            });
            return;
        }
        if (isNaN(parseFloat(req.body.package.credit))) {
            res.json({
                message: 'package.credit is not number'
            });
            return;
        }
        req.collection.update({
            customer_id: req.params.customer_id
        }, {
            $push: {
                purchased: req.body.package
            },
            $inc: {
                balance: parseFloat(req.body.package.total),
                credit: parseFloat(req.body.package.credit)
            }
        }, (err) => {
            if (!err) {
                const io = req.app.get('socket-io');
                io.sockets.emit('creditsPurchased', {
                    message: 'A customer purchase credits.'
                });
                res.statusCode = 201;
                this.getCredits(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }

    useCredit(req, res) {
        if (!req.body.service){
            res.json({
                message: 'no service'
            });
            return;
        }
        if (isNaN(parseFloat(req.body.useCredit))) {
            res.json({
                message: 'useCredit is not number'
            });
            return;
        }
        if (parseFloat(req.body.useCredit) <= 0) {
            res.json({
                message: 'useCredit is less than 0 or 0'
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
                creditUsed: {
                    service: req.body.service,
                    credit: parseFloat(req.body.useCredit),
                    createdAt: new Date()
                }
            }
        }, (err) => {
            if (!err) {
                res.statusCode = 201;
                this.getCredits(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }
}

module.exports = creditsController;
