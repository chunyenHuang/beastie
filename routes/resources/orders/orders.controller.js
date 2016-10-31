const AbstractController = require('../../abstract/AbstractController.js');
class OrdersController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            pet_id: null,
            scheduleAt: null,
            isCanceled: false,
            notShowup: false,
            checkInAt: null,
            checkOutAt: null,
            services: [],
            inhouseOrders: [],
            waivers: [],
            pictures: {
                checkIn: null,
                checkOut: null
            },
            total: null,
            isPaid: null,
            notes: null,

            createdAt: null,
            createdBy: null
        };
        res.json(template);
    }
}

module.exports = OrdersController;
