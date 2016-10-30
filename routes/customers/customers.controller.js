const AbstractController = require('../../abstract/AbstractController.js');
class UsersController extends AbstractController {
    somethingNew(req, res) {
        console.log('qwe');
    }
};

module.exports = UsersController;
