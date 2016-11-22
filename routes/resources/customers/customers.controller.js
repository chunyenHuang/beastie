const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;
class CustomersController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            firstname: null,
            lastname: null,
            address: {
                street: null,
                city: null,
                state: null,
                zipCode: null
            },
            phone: null,
            phones: [],
            emergencyContact: [{
                name: null,
                relationship: null,
                phones: [null]
            }]
            // createdAt: null,
            // lastLoginAt: null,
            // isDeleted: false
        };
        res.send(template);
    }

    // query(req, res) {
    //     Object.assign(req.query, {
    //         isDeleted: false
    //     });
    //     const query = req.collection.aggregate([
    //         {
    //             $match: req.query
    //         },
    //         {
    //             $lookup: {
    //                 from: 'pets',
    //                 localField: '_id',
    //                 foreignField: 'customer_id',
    //                 as: 'pets'
    //             }
    //         },{
    //             $lookup: {
    //                 from: 'orders',
    //                 localField: '_id',
    //                 foreignField: 'customer_id',
    //                 as: 'orders'
    //             }
    //         }
    //     ]);
    //     query.toArray((err, results) => {
    //         // fix wrong condition
    //         if (!err) {
    //             if (results.length > 0) {
    //                 res.statusCode = 200;
    //                 res.json(results);
    //             } else {
    //                 // res.sendStatus(404);
    //                 res.status(404).send({error:'Sorry, we cannot find that!'});
    //             }
    //         } else {
    //             res.sendStatus(500);
    //         }
    //     });
    // }

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
                    from: 'pets',
                    localField: '_id',
                    foreignField: 'customer_id',
                    as: 'pets'
                }
            },{
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer_id',
                    as: 'orders'
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

    getWithPets(req, res) {
        Object.assign(req.query, {
            _id: ObjectId(req.params.id),
            isDeleted: false
        });

        const query = req.collection.aggregate([
            {
                $match: req.query
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: '_id',
                    foreignField: 'customer_id',
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

}

module.exports = CustomersController;
