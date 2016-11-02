const AbstractController = require('../../abstract/AbstractController.js');
class OrdersController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            // require for appointment
            customer_id: null,
            pet_id: null,
            scheduleAt: null,
            notes: 'Note for this order/appointment.',
            // flag for cancel and fail to show up
            isCanceled: false,
            notShowup: false,
            // customer checkin in client device
            checkInAt: null,
            // select services
            services: [],
            total: null,
            // select inhouseOrders
            inhouseOrders: [],
            // special conditions
            waivers: [],
            // customer pay and admin manual closes order.
            isPaid: null,
            checkOutAt: null

            // createdAt: null,
            // createdBy: null
        };
        res.json(template);
    }
}

module.exports = OrdersController;
