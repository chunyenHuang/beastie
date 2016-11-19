const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const fs = require('fs');

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

    put(req, res) {
        Object.assign(req.body,{
            updatedAt: new Date(),
            updatedBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });
        console.log(res.body);

        if (req.body._id) {
            delete req.body._id;
        }
        req.collection.update({
            _id: ObjectId(req.params.id)
        }, {
            $set: req.body
        }, {
            upsert: true
        }, (err) => {
            if (!err) {
                if(req.file){
                    const newName = req.params.id + '.png';
                    req.oldPath = path.join(global.uploads, req.file.filename);
                    req.newPath = path.join(global.images, 'pets', newName);
                    this._moveFile(req, res, () => {
                        res.sendStatus(204);
                    });
                } else {
                    res.sendStatus(204);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }

    post(req, res) {
        Object.assign(req.body,{
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                if(req.file){
                    const newName = docsInserted.ops[0]._id + '.png';
                    req.oldPath = path.join(global.uploads, req.file.filename);
                    req.newPath = path.join(global.images, 'pets', newName);
                    this._moveFile(req, res, () => {
                        res.statusCode = 201;
                        res.json(docsInserted.ops[0]);
                    });
                } else {
                    res.statusCode = 201;
                    res.json(docsInserted.ops[0]);
                }
            } else {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }

}

module.exports = PetsController;
