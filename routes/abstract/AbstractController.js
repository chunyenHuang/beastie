const ObjectId = require('mongodb').ObjectID;

module.exports = class AbstractController {

    query(req, res) {
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
            _id: ObjectId(req.params.id)
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
        const data = req.body;
        req.collection.insert(data, (err, docsInserted) => {
            if (!err) {
                console.log(docsInserted);
                res.statusCode = 201;
                res.json(docsInserted.ops[0]);
            } else {
                res.statusCode = 500;
                res.send('Can not update');
            }
        });
    }

    delete(req, res) {}
};
