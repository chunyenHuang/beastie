const AbstractController = require('../../abstract/AbstractController.js');
class TransactionsController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            selfService_id: null,
            selfServicePackage_id: null,
            order_id: null,
            note: null,
            customer_id: null,
            total: null,
            paidByCash: false,
            createdAt: null
        };
        res.send(template);
    }
}

module.exports = TransactionsController;
