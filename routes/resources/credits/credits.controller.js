const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;

class creditsController extends AbstractController {
    constructor(){
        super();
    }
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

    queryCredit(req, res) {
        Object.assign(req.query, {
            isDeleted: false
        });
        console.log(req.query);
        const query = req.collection.aggregate([
            {
                $match: req.query
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
            // fix wrong condition
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results);
                } else {
                    // res.sendStatus(404);
                    res.status(404).send({
                        error: 'Sorry, we cannot find that!'
                    });
                }
            } else {
                res.sendStatus(500);
            }
        });
    }

    login(req, res) {
        if (!req.body.customer_id) {
            res.statusCode = 400;
            res.json({
                message: 'no customer_id'
            });
            return;
        }

        if (!req.body.pinPasswords) {
            res.statusCode = 400;
            res.json({
                message: 'no pinPasswords'
            });
            return;
        }
        if (req.body.pinPasswords.length != 6) {
            res.statusCode = 400;
            res.json({
                message: 'pinPasswords is not 6 digits'
            });
            return;
        }
        if (isNaN(parseInt(req.body.pinPasswords))) {
            res.statusCode = 400;
            res.json({
                message: 'pinPasswords is not numbers'
            });
            return;
        }

        const query = req.collection.find({
            customer_id: req.body.customer_id,
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
            customer_id: req.body.customer_id,
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
            customer_id: ObjectId(req.params.customer_id),
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
        if (!req.body.customer_id) {
            res.json({
                message: 'no customer_id'
            });
            return;
        }
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
        console.log(req.body.customer_id);
        req.collection.updateOne({
            customer_id: ObjectId(req.body.customer_id)
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
                    message: 'A customer purchase credits.',
                    data: {
                        customer_id: req.params.customer_id
                    }
                });
                res.statusCode = 201;
                this.getCredits(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }

    useCredit(req, res) {
        if (!req.body.service) {
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
            customer_id: ObjectId(req.body.customer_id)
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
