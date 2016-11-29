const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;
class SignaturesController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            // save all as it.
            order_id: null,
            customer_id: null,
            customer: {},
            pet: {},
            waiver: {},
            signatures: null
        };
        res.json(template);
    }

    init(req, res) {
        if (!req.body) {
            res.sendStatus(400);
        } else {
            const io = req.app.get('socket-io');
            io.sockets.emit('signaturesInit', req.body);
            res.sendStatus(200);
        }
    }

    signed(req, res) {
        Object.assign(req.body, {
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                if (req.body.name != 'registration') {
                    const io = req.app.get('socket-io');
                    io.sockets.emit('signaturesFinished', {
                        // test
                        waiverName: req.params.waiverName
                    });
                }
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}

module.exports = SignaturesController;
