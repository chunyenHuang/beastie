const TransactionsController = require('./transactions.controller');
const Transactions = new TransactionsController;
const dbCollectionName = 'transactions';

module.exports = (app) => {
    app.route('/transactions?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            if (req.body) {
                console.log(req.body);
            }
            next();
        })
        .get(Transactions.query.bind(Transactions))
        .post(
            Transactions.validateRequest.bind(Transactions),
            Transactions.checkout.bind(Transactions)
        );

    app.route('/transactions?/:id')
        .all((req, res, next) => {
            if (req.params.id == 'template') {
                Transactions.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Transactions.get.bind(Transactions))
        .put(Transactions.updateInfo.bind(Transactions))
        .post(Transactions.updateInfo.bind(Transactions))
        .delete(Transactions.delete.bind(Transactions));
};
