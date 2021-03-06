const SignaturesController = require('./signatures.controller');
const Signatures = new SignaturesController;
const dbCollectionName = 'signatures';

module.exports = (app) => {
    app.route('/signaturesInit')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .post(Signatures.init);

    app.route('/signatures?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Signatures.query)
        .post(Signatures.signed);

    app.route('/signatures?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                Signatures.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Signatures.get)
        .put(Signatures.put)
        .delete(Signatures.delete);
};
