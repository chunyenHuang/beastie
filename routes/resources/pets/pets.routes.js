const PetsController = require('./pets.controller');
const Pets = new PetsController;
const dbCollectionName = 'pets';

module.exports = (app) => {
    app.route('/pets')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Pets.query);

    app.route('/pets/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Pets.get)
        .put(Pets.put)
        .post(Pets.post)
        .delete(Pets.delete);
};
