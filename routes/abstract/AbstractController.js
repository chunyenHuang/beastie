const ObjectId = require('mongodb').ObjectID;

module.exports = class AbstractController {

    query(req, res) {
        Object.assign(req.query, {
            isDeleted: false
        });
        const query = req.collection.find(
            req.query
        );
        query.toArray((err, results) => {
            if (!err && results.length > 0) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }

    get(req, res) {
        const query = req.collection.find({
            _id: ObjectId(req.params.id),
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

    put(req, res) {
        req.body.updatedAt = new Date();
        req.body.updatedBy = (req.currentUser) ? req.currentUser._id : 'dev-test';

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
                console.log(Object.assign(req.body, {
                    _id: req.params.id
                }));
                res.sendStatus(204);
            } else {
                res.sendStatus(500);
            }
        });
    }

    post(req, res) {
        req.body.createdAt = new Date();
        req.body.createdBy = (req.currentUser) ? req.currentUser._id : 'dev-test';
        req.body.isDeleted = false;

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                res.sendStatus(500);
            }
        });
    }

    delete(req, res) {
        // soft delete
        if (req.body._id) {
            delete req.body._id;
        }
        req.collection.update({
            _id: ObjectId(req.params.id)
        }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: (req.currentUser) ? req.currentUser._id : 'dev-test'
            }
        }, {
            upsert: true
        }, (err) => {
            if (!err) {
                res.sendStatus(204);
            } else {
                res.sendStatus(500);
            }
        });
    }
};
