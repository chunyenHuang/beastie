const PrinterController = require('../printer/printer.controller.js');
class SelfServicesController extends PrinterController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            // package: null,
            services: [],
            addons: [],
            total: null,
            isPaid: null,
            checkOutAt: null,
            isDeleted: false
        };
        res.send(template);
    }

    query(req, res) {
        Object.assign(req.query, {
            isDeleted: false
        });
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

    purchase(req, res) {
        if(!req.body.customer_id){
            res.json({
                message: 'no customer_id'
            });
            return;
        }
        if(!req.body.total){
            res.json({
                message: 'no total'
            });
            return;
        }
        if(!req.body.services){
            res.json({
                message: 'no services'
            });
            return;
        }
        if(req.body.services.length ===0){
            res.json({
                message: 'services can not be nothing.'
            });
            return;
        }
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
                    message: 'A new purchase is created, please check and confirm.',
                    data: {
                        customer_id: req.body.customer_id
                    }
                });
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                res.sendStatus(500);
            }
        });
    }

}

module.exports = SelfServicesController;
