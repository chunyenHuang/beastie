const OrdersController = require('./orders.controller');
const Orders = new OrdersController;
const dbCollectionName = 'orders';

module.exports = (app) => {
    app.route('/ordersByDate?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Orders.getByDate.bind(Orders));

    app.route('/orders?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Orders.customQuery.bind(Orders))
        .post(Orders.post);

    app.route('/orders?/:id')
        .all((req, res, next) => {
            if (req.params.id == 'template') {
                Orders.getTemplate(req, res);
            } else {
                if(req.body.isPaid){
                    delete req.body.isPaid;
                }
                if(req.body.checkOutAt){
                    delete req.body.checkOutAt;
                }
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Orders.get)
        .put(Orders.put)
        .delete(Orders.delete);

};
