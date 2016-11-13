const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;
class SignaturesController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            order_id: null,
            type: null,
            signatures: null
        };
        res.json(template);
    }

    init(req, res) {
        if (!req.params.waiverName) {
            res.sendStatus(400);
        } else {
            const io = req.app.get('socket-io');
            io.sockets.emit('signaturesInit', {
                // test
                waiverName: req.params.waiverName
            });
            res.sendStatus(200);
        }
    }
}

module.exports = SignaturesController;
