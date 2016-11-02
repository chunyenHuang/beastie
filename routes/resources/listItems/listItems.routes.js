const ListItemsController = require('./listItems.controller');
const ListItems = new ListItemsController;
const dbCollectionName = 'listItems';

module.exports = (app) => {
    app.route('/listItems?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(ListItems.query)
        .post(ListItems.post);

    app.route('/listItems?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                ListItems.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(ListItems.get)
        .put(ListItems.put)
        .delete(ListItems.delete);
};
