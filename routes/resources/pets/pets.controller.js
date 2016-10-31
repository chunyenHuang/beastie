const AbstractController = require('../../abstract/AbstractController.js');
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
            sex: null,
            previousHistory: [],
            vaccinations: [
                {
                    name: null,
                    date: null
                }
            ],
            specialConditions: [
                {
                    description: null,
                    createdAt: null
                }
            ],
            additionalInstructions: [
                {
                    description: null,
                    createdAt: null
                }
            ],
            createdAt: null,
            isDeleted: false
        };
        res.json(template);
    }
}

module.exports = PetsController;
