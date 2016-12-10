const AbstractController = require('../../abstract/AbstractController.js');
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const fs = require('fs');

class PetsController extends AbstractController {
    constructor() {
        super();
        this._getPetsPicturesPath = this._getPetsPicturesPath.bind(this);
        this.lookups = [
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'owner'
                }
            }
        ];
    }
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
                // {
                //     name: null,
                //     issuedAt: null,
                //     expiredAt: null,
                //     createdAt: new Date()
                // }
            ],
            specialConditions: [
                // {
                //     description: null,
                //     createdAt: new Date()
                // }
            ],
            additionalInstructions: [
                // {
                //     description: null,
                //     createdAt: new Date()
                // }
            ],
            createdAt: new Date(),
            isDeleted: false
        };
        res.json(template);
    }

    customQuery(req, res) {
        req.callback = (req, res) => {
            const results = req.results;
            (function setPictures(pets, index, func, res) {
                if (index == pets.length) {
                    res.statusCode = 200;
                    res.json(pets);
                    return;
                }
                func(pets[index]._id, (filenames) => {
                    pets[index].pictures = filenames;
                    index++;
                    setPictures(pets, index, func, res);
                });
            })(results, 0, this._getPetsPicturesPath, res);
        };
        return this.query(req, res);
    }

    // query(req, res) {
    //     Object.assign(req.query, {
    //         isDeleted: false
    //     });
    //
    //     const query = req.collection.aggregate([
    //         {
    //             $match: req.query
    //         },
    //         {
    //             $lookup: {
    //                 from: 'customers',
    //                 localField: 'customer_id',
    //                 foreignField: '_id',
    //                 as: 'owner'
    //             }
    //         }
    //     ]);
    //
    //     // const query = req.collection.find(
    //     //     req.query
    //     // );
    //     query.toArray((err, results) => {
    //         // fix wrong condition
    //         if (!err) {
    //             if (results.length > 0) {
    //                 (function setPictures(pets, index, func, res) {
    //                     if (index == pets.length) {
    //                         res.statusCode = 200;
    //                         res.json(pets);
    //                         return;
    //                     }
    //                     func(pets[index]._id, (filenames) => {
    //                         pets[index].pictures = filenames;
    //                         index++;
    //                         setPictures(pets, index, func, res);
    //                     });
    //                 })(results, 0, this._getPetsPicturesPath, res);
    //             } else {
    //                 // res.sendStatus(404);
    //                 res.status(404).send({
    //                     error: 'Sorry, we cannot find that!'
    //                 });
    //             }
    //         } else {
    //             res.sendStatus(500);
    //         }
    //     });
    // }

    update(req, res) {
        Object.assign(req.body, {
            updatedAt: new Date(),
            updatedBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        if (req.body._id) {
            delete req.body._id;
            delete req.body.customer_id;
        }
        req.collection.updateOne({
            _id: ObjectId(req.params.id)
        }, {
            $set: req.body
        }, (err) => {
            if (!err) {
                return this.get(req, res);
            } else {
                res.sendStatus(500);
            }
        });
    }

    post(req, res) {
        Object.assign(req.body, {
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.insert(req.body, (err, docsInserted) => {
            if (!err) {
                if (req.file) {
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
        // pet_id + '-' + timestamp + '-' + order_id '.png';

        req.oldPath = path.join(global.uploads, req.file.filename);
        req.newPath = path.join(global.images, 'pets', newName);
        this._moveFile(req, res, () => {
            res.statusCode = 201;
            res.json({
                url: path.join('images/pets', newName)
            });
        });
    }

    getPicturesPath(req, res) {
        this._getPetsPicturesPath(req.params.id, (filenames) => {
            res.statusCode = 200;
            res.send(filenames);
        });
    }

    _getPetsPicturesPath(pet_id, callback) {
        const petsImagesPath = path.join(global.images, 'pets');
        const filenames = [];
        fs.readdirSync(petsImagesPath).forEach((filename) => {
            if (filename.indexOf(pet_id) > -1) {
                filenames.push(
                    path.join('images/pets', filename)
                );
            }
        });
        callback(filenames);
    }
}

module.exports = PetsController;
