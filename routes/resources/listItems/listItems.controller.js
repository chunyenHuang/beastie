const AbstractController = require('../../abstract/AbstractController.js');
class ListItemsController extends AbstractController {
    getTemplate(req, res) {
        const template = {
            type: null,
            items: []
        };
        res.send(template);
    }
}

module.exports = ListItemsController;
