const creditsController = require('./credits.controller');
const credits = new creditsController;
const dbCollectionName = 'credits';

module.exports = (app) => {
    app.route('/credits?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(credits.queryCredit.bind(this));

    app.route('/credits?/:customer_id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(credits.getCredits.bind(this))
        .put(credits.counterUpdate.bind(this));

    app.route('/credits?/:customer_id/login')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .put(credits.login.bind(credits))
        .post(credits.login.bind(credits));

    app.route('/credits?/:customer_id/purchase')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        }, credits._validateCreditPackage.bind(credits))
        .put(credits.purchase.bind(credits))
        .post(credits.purchase.bind(credits));

    app.route('/credits?/:customer_id/use')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .put(credits.useCredit.bind(credits))
        .post(credits.useCredit.bind(credits));

    // app.route('/selfServices?/:id/resetPinPasswords')
    //     .all((req, res, next) => {
    //         req.collection = req.db.collection('selfServicesPackages');
    //         next();
    //     })
    //     .get(SelfServices.resetPinPasswords.bind(SelfServices));

};
