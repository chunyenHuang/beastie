const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;

class ListItemsController extends AbstractController {
    constructor() {
        super();
        this._getTimestampKeyID = this._getTimestampKeyID.bind(this);
        // this.assignItemID = this._assignItemID.bind(this);
    }

    getTemplate(req, res) {
        const template = {
            type: null,
            items: []
        };
        res.send(template);
    }

    _getTimestampKeyID() {
        const keyID = parseInt(new Date().getTime() + Math.random()*1000);
        return keyID;
    }

    assignItemID(req, res, next) {
        if (req.body.items) {
            for (var i = 0; i < req.body.items.length; i++) {
                if(!req.body.items[i].keyID){
                    req.body.items[i].keyID = this._getTimestampKeyID();
                }
                if (req.body.items[i].subItems) {
                    for (var x = 0; x < req.body.items[i].subItems.length; x++) {
                        if(!req.body.items[i].subItems[x].keyID){
                            req.body.items[i].subItems[x].keyID = this._getTimestampKeyID();
                        }
                    }
                }
            }
        }
        next();
    }

    update(req, res) {
        Object.assign(req.body, {
            updatedAt: new Date(),
            updatedBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        if (req.body._id) {
            delete req.body._id;
        }
        req.collection.update({
            _id: ObjectId(req.params.id)
        }, {
            $set: req.body
        }, {
            upsert: true
        }, (err) => {
            if (!err) {
                this.get(req, res);
                // res.statusCode = 204;
                // res.json(result);
            } else {
                res.sendStatus(500);
            }
        });
    }

    save(req, res) {
        Object.assign(req.body, {
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                req.params.id = docsInserted.ops[0]._id;
                this.get(req, res);
                //
                // res.statusCode = 201;
                // res.json(docsInserted.ops[0]);
            } else {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }

}

module.exports = ListItemsController;
