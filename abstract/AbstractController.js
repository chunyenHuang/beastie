const ObjectId = require('mongodb').ObjectID;

module.exports = class AbstractController {

    query(req, res) {
        const query = req.collection.find(
            req.query
        );
        query.toArray((err, results) => {
            if (!err) {
                res.json(results);
            } else {
                res.json(results);
            }
        });
    }

    get(req, res) {
        console.log(req.params.id);
        const query = req.collection.find({
            _id: ObjectId(req.params.id)
        });
        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
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
                res.statusCode = 201;
                res.send();
            } else {
                console.log(err);
                res.statusCode = 500;
                res.send('Can not update');
            }
        });
    }

    post(req, res) {
        const data = req.body;
        req.collection.insert(data, (err, docsInserted) => {
            if (!err) {
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
