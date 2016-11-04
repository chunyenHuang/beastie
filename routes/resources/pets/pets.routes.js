const PetsController = require('./pets.controller');
const Pets = new PetsController;
const dbCollectionName = 'pets';

module.exports = (app) => {
    app.route('/pets?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Pets.query)
        .post(Pets.post);

    app.route('/pets?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                Pets.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Pets.get)
        .put(Pets.put)
        .delete(Pets.delete);
};
