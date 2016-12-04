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

}

module.exports = SelfServicesController;
