const ObjectId = require('mongodb').ObjectID;

module.exports = class AbstractController {
    query(req, res) {
        const query = req.collection.find(
            req.query
        );
        query.toArray((err, results) => {
            if (!err) {
                res.status(200).send(results);
            } else {
                this.resError('query');
            }
        });
    }
    get(req, res) {
        const query = req.collection.find({
            _id: ObjectId(id)
        });
        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    res.send(results[0]);
                } else {
                    res.send('No Results');
                }
            } else {
                res.send('No Results');
            }
        });
    }
    put(req, res) {
        const query = {
            _id: ObjectId(id)
        };
        const options = {
            upsert: true
        };
        req.collection.update(query, req.body, options, (err) => {
            if (!err) {
                res.status(200).send();
            } else {
                res.send('Can not update');
            }
        });
    }
    post(req, res) {}
    delete(req, res) {}
};
