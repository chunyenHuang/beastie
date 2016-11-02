const AbstractController = require('../../abstract/AbstractController.js');
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
                phones: []
            }]
            // createdAt: null,
            // lastLoginAt: null,
            // isDeleted: false
        };
        res.send(template);
    }
}

module.exports = CustomersController;
