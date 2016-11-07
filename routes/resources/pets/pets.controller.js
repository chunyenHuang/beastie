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
}

module.exports = PetsController;
