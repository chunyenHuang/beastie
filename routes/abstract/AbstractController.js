const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const fs = require('fs');

module.exports = class AbstractController {
    constructor(){
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.query = this.query.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
    }

    query(req, res) {
        Object.assign(req.query, {
            isDeleted: false
        });
        const query = req.collection.find(
            req.query
        );
        console.log(req.query);
        query.toArray((err, results) => {
            // fix wrong condition
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results);
                } else {
                    // res.sendStatus(404);
                    res.status(404).send({error:'Sorry, we cannot find that!'});
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
        Object.assign(req.body,{
            updatedAt: new Date(),
            updatedBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });
        console.log(res.body);

        if (req.body._id) {
            delete req.body._id;
        }
        req.collection.update({
            _id: ObjectId(req.params.id)
        }, {
            $set: req.body
        }, {
            upsert: true
        }, (err, result, extra) => {
            console.log(result);
            if (!err) {
                this.get(req, res);
                // res.statusCode = 204;
                // res.json(result);
            } else {
                res.sendStatus(500);
            }
        });
    }

    post(req, res) {
        Object.assign(req.body,{
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

    /*
        custom middleware
    */

    _moveFile(req, res, next) {
        fs.rename(req.oldPath, req.newPath, (err) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Can not move file.',
                    data: [],
                    error: {
                        type: 'UPLOAD'
                    }
                });
                return;
            } else {
                next();
            }
        });
    }
    /*
        helper functions
    */

    _setCorrectExtension(source, reference) {
        const unknowExt = this._getExtension(source);
        const extension = this._getExtension(reference);
        if (unknowExt.toLowerCase() != extension.toLowerCase()) {
            source += extension;
        }
        return source;
    }

    _getExtension(source) {
        const extensions = source.split('.');
        const extension = '.' + extensions[extensions.length - 1];
        return extension;
    }

};
