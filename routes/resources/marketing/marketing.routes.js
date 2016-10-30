const MarketingController = require('./marketing.controller');
const Marketing = new MarketingController;
const dbCollectionName = 'marketing';

module.exports = (app) => {
    app.route('/marketing')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Marketing.query);

    app.route('/marketing/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Marketing.get)
        .put(Marketing.put)
        .post(Marketing.post)
        .delete(Marketing.delete);
};
