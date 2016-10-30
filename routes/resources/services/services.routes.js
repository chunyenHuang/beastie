const ServicesController = require('./services.controller');
const Services = new ServicesController;
const dbCollectionName = 'services';

module.exports = (app) => {
    app.route('/services')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Services.query);

    app.route('/services/:id')
        .all((req, res, next) => {
            // const id = req.params['id'];
            // const hex = /[0-9A-Fa-f]{6}/g;
            // if (!hex.test(id) || id.length < 24) {
            //     return res.status(403).send('wrong id format');
            // }
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Services.get)
        .put(Services.put)
        .post(Services.post)
        .delete(Services.delete);
};
