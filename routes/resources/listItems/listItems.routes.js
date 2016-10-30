const ListItemsController = require('./listItems.controller');
const ListItems = new ListItemsController;
const dbCollectionName = 'listItems';

module.exports = (app) => {
    app.route('/listItems')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(ListItems.query);

    app.route('/listItems/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(ListItems.get)
        .put(ListItems.put)
        .post(ListItems.post)
        .delete(ListItems.delete);
};
