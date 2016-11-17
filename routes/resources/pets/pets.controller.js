const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;

class PetsController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            name: null,
            species: null,
            birthday: null,
            breed: null,
            color: null,
            weight: null,
            gender: null,
            isAllowPhoto: true,
            picture: null,
            previousHistory: [{
                description: null,
                createdAt: new Date()
            }],
            vaccinations: [
                {
                    name: null,
                    issuedAt: null,
                    expiredAt: null,
                    createdAt: new Date()
                }
            ],
            specialConditions: [
                {
                    description: null,
                    createdAt: new Date()
                }
            ],
            additionalInstructions: [
                {
                    description: null,
                    createdAt: new Date()
                }
            ],
            createdAt: new Date(),
            isDeleted: false
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
                    as: 'owner'
                }
            }
        ]);

        // const query = req.collection.find(
        //     req.query
        // );
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

module.exports = PetsController;
