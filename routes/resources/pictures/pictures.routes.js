const PicturesController = require('./pictures.controller');
const Pictures = new PicturesController;
const dbCollectionName = 'pictures';

module.exports = (app) => {
    app.route('/pictures?/uploads?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        // .get(Pictures.query)
        .post(Pictures.upload.bind(Pictures));

    app.route('/pictures?/:id')
        .all((req, res, next) => {
            if(req.params.id == 'template'){
                Pictures.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Pictures.get)
        .put(Pictures.put)
        .delete(Pictures.delete);
};
