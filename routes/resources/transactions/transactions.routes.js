const TransactionsController = require('./transactions.controller');
const Transactions = new TransactionsController;
const dbCollectionName = 'transactions';

module.exports = (app) => {
    app.route('/transactions?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Transactions.query)
        .post(Transactions.post);

    app.route('/transactions?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                Transactions.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Transactions.get)
        .put(Transactions.put)
        .delete(Transactions.delete);
};