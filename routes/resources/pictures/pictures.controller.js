const path = require('path');
const fs = require('fs');
const AbstractController = require('../../abstract/AbstractController.js');
class PicturesController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            customer_id: null,
            order_id: null,
            pet_id: null,
            before: [],
            beforeNotes: null,
            after: [],
            afterNotes: null
        };
        res.json(template);
    }

    upload(req, res) {
        if (!req.file || !req.body.filename) {
            res.sendStatus(400);
            return;
        }
        const timestamp = new Date().getTime()
        const newName = req.body.filename;

        req.oldPath = path.join(global.uploads, req.file.filename);
        req.newPath = path.join(global.images, timestamp, '.png');
        this._moveFile(req, res, () => {
            this._print(req, res, () => {
                res.sendStatus(200);
            });
        });
    }


}

module.exports = PicturesController;
