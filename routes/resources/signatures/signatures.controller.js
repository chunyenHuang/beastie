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

    init(req, res){
        /*
        search listItems for waivers
        */
        const query = req.collection.find({
            _id: ObjectId(req.params.id),
            isDeleted: false
        });
        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    const io = req.app.get('socket-io');
                    io.sockets.emit('signaturesInit', {
                        message: 'init signature',
                        data: {
                            waivers: results[0]
                        }
                    });
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(500);
            }
        });

    }
}

module.exports = SignaturesController;
