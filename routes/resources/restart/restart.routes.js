const RestartController = require('./restart.controller');
const Restart = new RestartController;

module.exports = (app) => {
    app.route('/restart?')
        .get(Restart.restart);
};
