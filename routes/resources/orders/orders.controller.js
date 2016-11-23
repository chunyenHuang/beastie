const path = require('path');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectID;

const AbstractController = require('../../abstract/AbstractController.js');
class OrdersController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            // require for appointment
            customer_id: null,
            pet_id: null,
            scheduleAt: null,
            notes: null,
            // flag for cancel and fail to show up
            isCanceled: false,
            notShowup: false,
            // customer checkin in client device
            checkInAt: null,
            checkInNumber: null, // rush, 1, 2
            isRush: false,
            // select services
            services: null,
            total: null,
            // select inhouseOrders
            inhouseOrders: null,
            // special conditions
            // waivers: [],
            // customer pay and admin manual closes order.
            isPaid: null,
            checkOutAt: null

            // createdAt: null,
            // createdBy: null
        };
        res.json(template);
    }

    query(req, res) {
        Object.assign(req.query, {
            isDeleted: false
        });
        const query = req.collection.aggregate([
            {
                $match: req.query
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'customers'
                }
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: 'pet_id',
                    foreignField: '_id',
                    as: 'pets'
                }
            }
        ]);
        query.toArray((err, results) => {
            // fix wrong condition
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results);
                } else {
                    // res.sendStatus(404);
                    res.status(404).send({error:'Sorry, we cannot find that!'});
                }
            } else {
                res.sendStatus(500);
            }
        });
    }


    get(req, res) {
        const query = req.collection.aggregate([
            {
                $match: {
                    _id: ObjectId(req.params.id),
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'customers'
                }
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: 'pet_id',
                    foreignField: '_id',
                    as: 'pets'
                }
            }
        ]);

        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results[0]);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }


    upload(req, res) {
        if (!req.file) {
            res.statusCode = 400;
            res.json({
                message: 'no file.'
            });
            return;
        }
        if (!req.body.filename) {
            res.statusCode = 400;
            res.json({
                message: 'no filename ( order_id + "-" + timestamp + ".png")'
            });
            return;
        }
        // const timestamp = new Date().getTime()
        const newName = req.body.filename;
        // order_id + '-' + timestamp + '.png';

        req.oldPath = path.join(global.uploads, req.file.filename);
        req.newPath = path.join(global.images, 'orders', newName);
        this._moveFile(req, res, () => {
            res.sendStatus(200);
        });
    }

    getPicturesPath(req, res) {
        const ordersImagesPath = path.join(global.images, 'orders');
        const filenames = [];
        fs.readdirSync(ordersImagesPath).forEach((filename) => {
            if (filename.indexOf(req.params.id) > -1) {
                filenames.push(
                    path.join('images/orders', filename)
                );
            }
        });
        res.send(filenames);
    }

    // transformDates(req, res, next) {
    //     if (req.body) {
    //         for (let prop in req.body) {
    //             if (
    //                 prop == 'scheduleAt' ||
    //                 prop == 'checkInAt' ||
    //                 prop == 'updatedAt'
    //             ) {
    //                 if (typeof (req.body[prop]) == 'string') {
    //                     console.log(new Date(req.body[prop]));
    //                     req.body[prop] = new Date(req.body[prop]);
    //                 }
    //             }
    //         }
    //     }
    //     next();
    // }

    _parseDate(dateString) {
        const newDateString = new Date(dateString);
        // const newDateString =
        //     dateString.getFullYear() + '-' +
        //     (dateString.getMonth()+1) + '-' +
        //     dateString.getDate() + 'T00:00:00.000Z';
        dateString = new Date(
            newDateString.getFullYear(),
            newDateString.getMonth(),
            newDateString.getDate()
        );
        return dateString;
    }

    _getDateFromToday(num, startDate) {
        num = num || 0;
        parseInt(num);
        const targetDate = (startDate) ? new Date(startDate) : new Date();
        /*
            yesterday num = -1,
            tomorrow num = 1
        */
        return this._parseDate(
            new Date(targetDate.getTime() +
                parseInt(num) * 24 * 60 * 60 * 1000)
        );
    }

    getByDate(req, res) {
        /*
            /ordersByDate?date= &from= &to= &last= &next=
            date= specific date only
            from= date
            to= date
            last= num
            next= num
        */
        let from;
        let to;
        if (req.query.date) {
            from = this._getDateFromToday(1, this._parseDate(req.query.date));
            to = this._getDateFromToday(2, this._parseDate(req.query.date));
        } else {
            let today = this._getDateFromToday();
            from = (req.query.from) ? this._parseDate(req.query.from) :
                ((req.query.last) ? this._getDateFromToday(req.query.last) : today);
            to = (req.query.to) ? this._parseDate(req.query.to) :
                ((req.query.next) ? this._getDateFromToday(req.query.next) : this._getDateFromToday(1));
        }
        console.log(req.query);
        console.log('from:', from);
        console.log('to:', to);
        // const query = req.collection.find({
        //     isDeleted: false,
        //     scheduleAt: {
        //         $gte: from,
        //         $lt: to
        //     }
        // });
        const query = req.collection.aggregate([
            {
                $match: {
                    isDeleted: false,
                    scheduleAt: {
                        $gte: from,
                        $lt: to
                    }
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'customers'
                }
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: 'pet_id',
                    foreignField: '_id',
                    as: 'pets'
                }
            }

        ]);

        query.toArray((err, results) => {
            // fix wrong condition
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results);
                } else if (results.length == 0) {
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

// quick fix for date range query
// for(let prop in req.query){
//     if (prop.search(/At$/)>-1) {
//         req.query[prop] = JSON.parse(req.query[prop]);
//         for (let innerProp in req.query[prop]) {
//             // mongodb compare stuff...
//             let re = /^\$eq|^\$gt|^\$gte|^\$lt|^\$lte|^\$ne|^\$in|^\$nin/;
//             if (innerProp.search(re)>-1) {
//                 req.query[prop][innerProp] = new Date(req.query[prop][innerProp])
//             }
//         }
//     }
// }

module.exports = OrdersController;