const AbstractController = require('../../abstract/AbstractController.js');
class <%= upCaseName %>Controller extends AbstractController {
    getTemplate(req, res) {
        const template = {
        };
        res.send(template);
    }
}

module.exports = <%= upCaseName %>Controller;
