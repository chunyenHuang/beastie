const AbstractController = require('../../abstract/AbstractController.js');
class SignaturesController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            order_id: null,
            type: null,
            signatures: null
        };
        res.json(template);
    }

}

module.exports = SignaturesController;
