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

}

module.exports = PicturesController;
