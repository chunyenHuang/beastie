const OrdersController = require('./orders.controller');
const Orders = new OrdersController;
const dbCollectionName = 'orders';

module.exports = (app) => {
    app.route('/orders')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Orders.query);

    app.route('/orders/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                Orders.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Orders.get)
        .put(Orders.put)
        .post(Orders.post)
        .delete(Orders.delete);
};
