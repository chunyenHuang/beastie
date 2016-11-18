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
