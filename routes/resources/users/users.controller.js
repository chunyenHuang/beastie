const AbstractController = require('../../abstract/AbstractController.js');
class UsersController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            name: null,
            role: null,
            loginId: null,
            password: null
        };
        res.send(template);
    }
    validate(req, res, next) {
        const requires = [
            'name', 'role', 'loginId', 'password'
        ];
        const errors = [];
        requires.forEach((require) => {
            if (!req.body[require]) {
                errors.push(require + ' is required.');
            }
        });
        if (errors.length > 0) {
            res.statusCode = 400;
            res.send(errors);
        } else {
            next();
        }
    }
}

module.exports = UsersController;
