const UserAuthController = require('./userAuth.controller');
const UserAuth = new UserAuthController;
const dbCollectionName = 'users';

module.exports = (app) => {
    app.route('/userAuth')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(UserAuth.getCurrentUser)
        .post(UserAuth.login)
        .put(UserAuth.login)
        .delete(UserAuth.logout);
};
