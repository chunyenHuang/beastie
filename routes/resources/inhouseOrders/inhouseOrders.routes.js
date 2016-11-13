const InhouseOrdersController = require('./inhouseOrders.controller');
const InhouseOrders = new InhouseOrdersController;
const dbCollectionName = 'inhouseOrders';

module.exports = (app) => {
    app.route('/inhouseOrders?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        // .get(InhouseOrders.query)
        .post(InhouseOrders.print.bind(InhouseOrders));

    // app.route('/inhouseOrders?/:id')
    //     .all((req, res, next) => {
    //         if(req.params.id == 'template'){
    //             InhouseOrders.getTemplate(req, res);
    //         } else {
    //             req.collection = req.db.collection(dbCollectionName);
    //             next();
    //         }
    //     })
    //     .get(InhouseOrders.get)
    //     .put(InhouseOrders.put)
    //     .delete(InhouseOrders.delete);
};
