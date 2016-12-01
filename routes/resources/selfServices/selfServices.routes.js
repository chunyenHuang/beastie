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
        .post(SelfServices.post.bind(SelfServices));

    app.route('/selfServices?/:customer_id')
        .all((req, res, next) => {
            if (req.params.customer_id == 'template') {
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

    app.route('/selfServices?/:customer_id/print')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(SelfServices.printTicket.bind(SelfServices));

    /*
        Packages
    */
    app.route('/selfServicesPackages?/:customer_id')
        .all((req, res, next) => {
            req.collection = req.db.collection('selfServicesPackages');
            next();
        })
        .get(SelfServices.get.bind(SelfServices));

    /*
        login
    */
    app.route('/selfServicesPackages?/:customer_id/login')
        .all((req, res, next) => {
            req.collection = req.db.collection('selfServicesPackages');
            next();
        })
        .put(SelfServices.login.bind(SelfServices))
        .post(SelfServices.login.bind(SelfServices));

    /*
        Purchase Packages
    */
    app.route('/selfServicesPackages?/:customer_id/purchase')
        .all((req, res, next) => {
            req.collection = req.db.collection('selfServicesPackages');
            next();
        })
        .put(SelfServices.purchase.bind(SelfServices))
        .post(SelfServices.purchase.bind(SelfServices));
    app.route('/selfServicesPackages?/:customer_id/payBalance')
        .all((req, res, next) => {
            req.collection = req.db.collection('selfServicesPackages');
            next();
        })
        .put(SelfServices.payBalance.bind(SelfServices))
        .post(SelfServices.payBalance.bind(SelfServices));
    app.route('/selfServicesPackages?/:customer_id/useCredit')
        .all((req, res, next) => {
            req.collection = req.db.collection('selfServicesPackages');
            next();
        })
        .put(SelfServices.useCredit.bind(SelfServices))
        .post(SelfServices.useCredit.bind(SelfServices));


    // app.route('/selfServices?/:id/resetPinPasswords')
    //     .all((req, res, next) => {
    //         req.collection = req.db.collection('selfServicesPackages');
    //         next();
    //     })
    //     .get(SelfServices.resetPinPasswords.bind(SelfServices));

};
