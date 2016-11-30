const AbstractController = require('../../abstract/AbstractController.js');
class SelfServicePackagesController extends AbstractController {
    getTemplate(req, res){
        const template = {
            customer_id: null,
            package: null, // target
            quantity: null, // will be used to match with `used`
            used: [/* new Date() */],
            isPaid: null,
            isDeleted: false
        };
        res.send(template);
    }
}

module.exports = SelfServicePackagesController;
