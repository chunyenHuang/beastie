const ObjectId = require('mongodb').ObjectID;
// const path = require('path');
const fs = require('fs');

module.exports = class AbstractController {
    constructor() {
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.query = this.query.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);

        this._parseDate = this._parseDate.bind(this);
        this._getDateFromToday = this._getDateFromToday.bind(this);
        this._setQueryDate = this._setQueryDate.bind(this);
        this._setLookup = this._setLookup.bind(this);
    }

    query(req, res) {
        this._setQueryDate(req, res, () => {
            this._setLookup(req, res, () => {
                Object.assign(req.query, {
                    isDeleted: false
                });
                req.aggregations.push({
                    $match: req.query
                });
                console.log(req.query);
                console.log(req.aggregations);
                const query = req.collection.aggregate(req.aggregations);
                query.toArray((err, results) => {
                    if (!err) {
                        if (results.length > 0) {
                            if (!req.callback) {
                                res.statusCode = 200;
                                res.json(results);
                            } else {
                                req.results = results;
                                return req.callback(req, res);
                            }
                        } else {
                            res.status(404).send({
                                error: 'Sorry, we cannot find that!'
                            });
                        }
                    } else {
                        res.sendStatus(500);
                    }
                });
            });
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
        Object.assign(req.body, {
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
        }, (err, result) => {
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
        Object.assign(req.body, {
            isDeleted: false,
            updatedAt: new Date(),
            updatedBy: ((req.currentUser) ? req.currentUser._id : 'dev-test'),
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

    _setQueryDate(req, res, next) {
        if (!req.query['dateField']) {
            return next();
        }
        let from,
            to;
        if (req.query['date']) {
            from = this._getDateFromToday(0, this._parseDate(req.query['date']));
            to = this._getDateFromToday(1, this._parseDate(req.query['date']));
        } else {
            let today = this._getDateFromToday();
            from = (req.query['from']) ? this._parseDate(req.query['from']) :
                ((req.query['last']) ? this._getDateFromToday(-req.query['last']) : today);
            to = (req.query['to']) ? this._parseDate(req.query['to']) :
                ((req.query['next']) ?
                    this._getDateFromToday(req.query['next']) : this._getDateFromToday(1));
        }
        const dateQueryFields = ['dateField', 'date', 'from', 'to', 'last', 'next'];
        const dateQuery = {};
        dateQuery[req.query.dateField] = {
            $gte: from,
            $lt: to
        };
        Object.assign(req.query, dateQuery);
        for (var i = 0; i < dateQueryFields.length; i++) {
            delete req.query[dateQueryFields[i]];
        }
        return next();
    }

    _setLookup(req, res, next) {
        req.aggregations = [];
        if (!req.query.nolookup && !req.query.nolookups) {
            return next();
        }
        req.lookups = req.lookups || this.lookups || [];
        delete req.query.nolookup;
        delete req.query.nolookups;
        req.aggregations = req.aggregations.concat(req.lookups);
        return next();
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

    _parseDate(dateString) {
        const newDateString = new Date(dateString);
        dateString = new Date(
            newDateString.getFullYear(),
            newDateString.getMonth(),
            newDateString.getDate()
        );
        return dateString;
    }

    _getDateFromToday(num, startDate) {
        num = num || 0;
        parseInt(num);
        const targetDate = (startDate) ? new Date(startDate) : new Date();
        /*
            yesterday num = -1,
            tomorrow num = 1
        */
        return this._parseDate(
            new Date(targetDate.getTime() +
                parseInt(num) * 24 * 60 * 60 * 1000)
        );
    }

};
