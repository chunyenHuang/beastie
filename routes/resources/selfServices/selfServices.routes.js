const SelfServicesController = require('./selfServices.controller');
const SelfServices = new SelfServicesController;
const dbCollectionName = 'selfServices';

module.exports = (app) => {

    app.route('/selfServices?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(SelfServices.query.bind(SelfServices))
        .post(SelfServices.purchase.bind(SelfServices));
    app.route('/selfServices?/:id')
        .all((req, res, next) => {
            if (req.params.id == 'template') {
                SelfServices.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(SelfServices.get.bind(SelfServices))
        .put(SelfServices.put.bind(SelfServices))
        .post(SelfServices.put.bind(SelfServices))
        .delete(SelfServices.delete.bind(SelfServices));

    // app.route('/selfServices?/:id/print')
    //     .all((req, res, next) => {
    //         req.collection = req.db.collection(dbCollectionName);
    //         next();
    //     })
    //     .get(SelfServices.printTicket.bind(SelfServices));

};
