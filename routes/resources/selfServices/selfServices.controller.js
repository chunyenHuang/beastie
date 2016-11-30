const AbstractController = require('../../abstract/AbstractController.js');
class SelfServicesController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            package: null,
            service: null,
            addon: [],
            total: null,
            isPaid: null,
            isDeleted: false
        };
        res.send(template);
    }
}

module.exports = SelfServicesController;
