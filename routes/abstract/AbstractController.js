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
            if (!err) {
                res.statusCode = 200;
                res.json(results);
            } else {
                res.json(results);
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
                    res.send('No Results');
                }
            } else {
                res.send('No Results');
            }
        });
    }

    put(req, res) {
        console.log(req.body);
        req.body.updatedAt = new Date();
        req.body.updatedBy = req.currentUser._id;

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
                res.statusCode = 201;
                res.send();
            } else {
                res.statusCode = 500;
                res.send('Can not update');
            }
        });
    }

    post(req, res) {
        req.body.createdAt = new Date();
        req.body.createdBy = req.currentUser._id;

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                res.statusCode = 500;
                res.send('Can not update');
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
                deletedBy: req.currentUser._id
            }
        }, {
            upsert: true
        }, (err) => {
            if (!err) {
                res.statusCode = 201;
                res.send('Soft Delete successfully.');
            } else {
                res.statusCode = 500;
                res.send('Can not delete');
            }
        });
    }
};
