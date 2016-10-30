const CustomersController = require('./customers.controller');
const Customers = new CustomersController;
const dbCollectionName = 'customers';

module.exports = (app) => {
    app.route('/customers')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Customers.query);

    app.route('/customers/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Customers.get)
        .put(Customers.put)
        .post(Customers.post)
        .delete(Customers.delete);
};
