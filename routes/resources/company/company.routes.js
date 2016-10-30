const CompanyController = require('./company.controller');
const Company = new CompanyController;
const dbCollectionName = 'company';

module.exports = (app) => {
    app.route('/company')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Company.query);

    app.route('/company/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Company.get)
        .put(Company.put)
        .post(Company.post)
        .delete(Company.delete);
};
