const PrinterController = require('./printer.controller');
const Printer = new PrinterController;

module.exports = (app) => {
    app.route('/printers?')
        .get(Printer.check.bind(Printer));
    app.route('/printers?/test')
        .get(Printer.test.bind(Printer));
};
