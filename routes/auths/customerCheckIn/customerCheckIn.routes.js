const CustomerCheckInController = require('./customerCheckIn.controller');
const CustomerCheckIn = new CustomerCheckInController;
const dbCollectionName = 'customers';

module.exports = (app) => {
    app.route('/customerCheckIn/:phone')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(CustomerCheckIn.checkIn);
};
