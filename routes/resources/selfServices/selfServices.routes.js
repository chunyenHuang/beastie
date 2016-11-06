const SelfServicesController = require('./selfServices.controller');
const SelfServices = new SelfServicesController;
const dbCollectionName = 'selfServices';

module.exports = (app) => {
    app.route('/selfServices?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(SelfServices.query)
        .post(SelfServices.post);

    app.route('/selfServices?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                SelfServices.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(SelfServices.get)
        .put(SelfServices.put)
        .delete(SelfServices.delete);
};
