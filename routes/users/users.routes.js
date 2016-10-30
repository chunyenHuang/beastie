const UsersController = require('./users.controller');
const Users = new UsersController;

module.exports = (app) => {
    app.route('/users')
        .all((req, res, next) => {
            req.collection = req.db.collection('users');
            next();
        })
        .get(Users.query);

    app.route('/users/:id')
        .all((req, res, next) => {
            const id = req.params['id'];
            const hex = /[0-9A-Fa-f]{6}/g;
            if (!hex.test(id) || id.length < 24) {
                return res.status(403).send('wrong id format');
            }
            req.collection = req.db.collection('users');
            next();
        })
        .get(Users.get)
        .put(Users.put)
        .post(Users.post)
        .delete(Users.delete);
};
