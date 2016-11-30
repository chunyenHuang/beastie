const SelfServicePackagesController = require('./selfServicePackages.controller');
const SelfServicePackages = new SelfServicePackagesController;
const dbCollectionName = 'selfServicePackages';

module.exports = (app) => {
    app.route('/selfServicePackages?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(SelfServicePackages.query)
        .post(SelfServicePackages.post);

    app.route('/selfServicePackages?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                SelfServicePackages.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(SelfServicePackages.get)
        .put(SelfServicePackages.put)
        .delete(SelfServicePackages.delete);
};
