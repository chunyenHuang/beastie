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
            services: null,
            total: null,
            // select inhouseOrders
            inhouseOrders: null,
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

    transformDates(req, res, next) {
        if (req.body) {
            for (let prop in req.body) {
                if (
                    prop == 'scheduleAt' ||
                    prop == 'checkInAt' ||
                    prop == 'updatedAt'
                ) {
                    if (typeof (req.body[prop]) == 'string') {
                        console.log(new Date(req.body[prop]));
                        req.body[prop] = new Date(req.body[prop]);
                    }
                }
            }
        }
        next();
    }

    getByDate(req, res) {
        // const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        // const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        const past = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
        const today = new Date();
        const from = (req.query.from) ? req.query.from : past;
        const to = (req.query.to) ? req.query.to : today;

        const query = req.collection.find({
            isDeleted: false,
            scheduleAt: {
                $gte: new Date(from),
                $lt: new Date(to)
            }
        });
        query.toArray((err, results) => {
            // fix wrong condition
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results);
                } else {
                    // res.sendStatus(404);
                    res.status(404).send({
                        error: 'Sorry, we cannot find that!'
                    });
                }
            } else {
                res.sendStatus(500);
            }
        });

    }
}

module.exports = OrdersController;
