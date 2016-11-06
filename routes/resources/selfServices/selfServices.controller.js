const AbstractController = require('../../abstract/AbstractController.js');
class SelfServicesController extends AbstractController {
    getTemplate(req, res) {
        const template = {
        };
        res.send(template);
    }
}

module.exports = SelfServicesController;
