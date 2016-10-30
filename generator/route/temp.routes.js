const <%= upCaseName %>Controller = require('./<%= name %>.controller');
const <%= upCaseName %> = new <%= upCaseName %>Controller;
const dbCollectionName = '<%= name %>';

module.exports = (app) => {
    app.route('/<%= name %>')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(<%= upCaseName %>.query);

    app.route('/<%= name %>/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(<%= upCaseName %>.get)
        .put(<%= upCaseName %>.put)
        .post(<%= upCaseName %>.post)
        .delete(<%= upCaseName %>.delete);
};
