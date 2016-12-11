const ServerMiddlewares = class ServerMiddlewares {
    constructor() {
    }
    transformRequest(req, res, next) {
        if (req.body) {
            const ObjectId = require('mongodb').ObjectID;
            for (let prop in req.body) {
                if (prop.indexOf('_id') > -1) {
                    req.body[prop] = ObjectId(req.body[prop]);
                }
                if (prop.search(/At$/) > -1) {
                    if (req.body[prop]) {
                        req.body[prop] = new Date(req.body[prop]);
                    }
                }
            }
        }
        if (req.query) {
            const ObjectId = require('mongodb').ObjectID;
            for (let prop in req.query) {
                if (prop.indexOf('_id') > -1) {
                    req.query[prop] = ObjectId(req.query[prop]);
                }
                if (prop.search(/At$/) > -1) {
                    if (req.body[prop]) {
                        req.body[prop] = new Date(req.body[prop]);
                    }
                }
            }
        }
        if (req.params) {
            const ObjectId = require('mongodb').ObjectID;
            for (let prop in req.params) {
                if (prop.indexOf('_id') > -1) {
                    req.params[prop] = ObjectId(req.params[prop]);
                }
            }
        }
        console.log(req.params);
        next();
    }

}
module.exports = new ServerMiddlewares();
