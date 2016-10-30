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
            const id = req.params['id'];
            const hex = /[0-9A-Fa-f]{6}/g;
            if (!hex.test(id) || id.length < 24) {
                return res.status(403).send('wrong id format');
            }
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(<%= upCaseName %>.get)
        .put(<%= upCaseName %>.put)
        .post(<%= upCaseName %>.post)
        .delete(<%= upCaseName %>.delete);
};
