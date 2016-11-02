const SettingsController = require('./settings.controller');
const Settings = new SettingsController;
const dbCollectionName = 'settings';

module.exports = (app) => {
    app.route('/settings?')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Settings.query)
        .post(Settings.post);

    app.route('/settings?/:id')
        .all((req, res, next) => {
            req.collection = req.db.collection(dbCollectionName);
            next();
        })
        .get(Settings.get)
        .put(Settings.put)
        .delete(Settings.delete);
};
