const UsersController = require('./users.controller');
const Users = new UsersController;
const dbCollectionName = 'users';

module.exports = (app) => {
    app.route('/users?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Users.query)
        .post(Users.validate, Users.post);

    app.route('/users?/:id')
        .all((req, res, next) => {
            // /users/template
            if(req.params.id == 'template'){
                Users.getTemplate(req, res);
            } else {
                req.collection = req.db.collection(dbCollectionName);
                next();
            }
        })
        .get(Users.get)
        .put(Users.validate, Users.put)
        .delete(Users.delete);
};
