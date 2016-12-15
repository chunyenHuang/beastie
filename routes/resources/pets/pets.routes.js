const PetsController = require('./pets.controller');
const Pets = new PetsController;
const dbCollectionName = 'pets';

module.exports = (app) => {
    app.route('/pets?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Pets.customQuery.bind(Pets))
        .post(Pets.post.bind(Pets));

    app.route('/pets?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                Pets.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Pets.get.bind(Pets))
        .post(Pets.update.bind(Pets))
        .put(Pets.update.bind(Pets))
        .delete(Pets.delete);

    app.route('/pets?/:id/pictures?')
        .get(Pets.getPicturesPath.bind(Pets));

    app.route('/pets?/:id/uploads?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .put(Pets.upload.bind(Pets))
        .post(Pets.upload.bind(Pets));
    app.route('/pets?/:id/uploadVaccinationDocuments?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .put(Pets.uploadVaccinationDocument.bind(Pets))
        .post(Pets.uploadVaccinationDocument.bind(Pets));

};
