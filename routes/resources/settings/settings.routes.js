const SettingsController = require('./settings.controller');
const Settings = new SettingsController;
const dbCollectionName = 'settings';

module.exports = (app) => {
    app.route('/settings')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Settings.query);

    app.route('/settings/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Settings.get)
        .put(Settings.put)
        .post(Settings.post)
        .delete(Settings.delete);
};
