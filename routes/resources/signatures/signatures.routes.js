const SignaturesController = require('./signatures.controller');
const Signatures = new SignaturesController;
const dbCollectionName = 'signatures';

module.exports = (app) => {
    app.route('/signatures')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Signatures.query);

    app.route('/signatures/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Signatures.get)
        .put(Signatures.put)
        .post(Signatures.post)
        .delete(Signatures.delete);
};
