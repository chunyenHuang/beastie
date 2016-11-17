const path = require('path');
const fs = require('fs');
// const escpos = require('escpos');
// let device;
// let printer;
// try {
//     device = new escpos.USB();
//     printer = new escpos.Printer(device);
// } catch (err) {
//     console.log('-----------------------------------');
//     console.log('Please Connect the Receipt Printer.');
//     console.log('-----------------------------------');
// }
const PrinterController = require('../printer/printer.controller.js');
const escpos = PrinterController.escpos;
const device = PrinterController.device;
const printer = PrinterController.printer;

const AbstractController = require('../../abstract/AbstractController.js');
class InhouseOrdersController extends AbstractController {
    constructor() {
        super();
    }

    getTemplate(req, res) {
        const template = {
            file: null,
            filename: null,
            order_id: null
        };
        res.send(template);
    }

    print(req, res) {
        if (!req.file || !req.body.filename || !req.body.order_id) {
            res.sendStatus(400);
            return;
        }
        // console.log(req.file);
        // console.log(req.body.filename);
        // const newName = this._setCorrectExtension(req.file.filename, req.file.originalname);
        const newName = req.body.filename;
        req.oldPath = path.join(global.uploads, req.file.filename);
        req.newPath = path.join(global.images, 'inhouseOrders', newName);
        this._moveFile(req, res, () => {
            this._print(req, res, () => {
                res.sendStatus(200);
            });
        });
    }

    _print(req, res, next) {
        if (!device) {
            next();
            return;
        }
        // const barcode = req.body.order_id;
        escpos.Image.load(req.newPath, (image) => {
            device.open(() => {
                const today = new Date();
                printer
                    .font('A')
                    .align('ct')
                    .style('b')
                    .size(2, 4)
                    .text(' ')
                    .text('A+ Pet Grooming')
                    .text('------------------------')
                    .text('In-House Orders')
                    .text('------------------------')
                    .raster(image)
                    .text('------------------------')
                    .text(req.body.order_id)
                    .text('------------------------')
                    .text(today.toLocaleDateString())
                    .text(today.toLocaleTimeString())
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .text(' ')
                    .cut();
                // .text('中文測試到底可不可以', 'Big5')
                // .barcode(barcode, 'EAN13')
                // .image(image, 's8')
                // .image(image, 'd8')
                // .image(image, 's24')
                // .image(image, 'd24')
                // .raster(image, 'dw')
                // .raster(image, 'dh')
                // .raster(image, 'dwdh')
                // .qrimage('https://github.com/song940/node-escpos', function(err){
                //   this.cut();
                // });

                next();
            });
        });
    }

    _moveFile(req, res, next) {
        fs.rename(req.oldPath, req.newPath, (err) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Can not move file.',
                    data: [],
                    error: {
                        type: 'UPLOAD'
                    }
                });
                return;
            } else {
                next();
            }
        });
    }

    _setCorrectExtension(source, reference) {
        const unknowExt = this._getExtension(source);
        const extension = this._getExtension(reference);
        if (unknowExt.toLowerCase() != extension.toLowerCase()) {
            source += extension;
        }
        return source;
    }

    _getExtension(source) {
        const extensions = source.split('.');
        const extension = '.' + extensions[extensions.length - 1];
        return extension;
    }
}

module.exports = InhouseOrdersController;
