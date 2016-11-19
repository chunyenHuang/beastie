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
// const escpos = PrinterController.escpos;
// const device = PrinterController.device;
// const printer = PrinterController.printer;

// const AbstractController = require('../../abstract/AbstractController.js');
class InhouseOrdersController extends PrinterController {
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
        if (!req.file || !req.body.filename) {
            res.sendStatus(400);
            return;
        }
        req.body.order_id = req.body.order_id || 'no order_id';
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
        if (!this.device) {
            next();
            return;
        }
        // const barcode = req.body.order_id;
        const logoPath = path.join(global.root, 'logos/B1_72-01.png');
        console.log(logoPath);
        this.escpos.Image.load(logoPath, (logo) => {
            this.escpos.Image.load(req.newPath, (image) => {
                this.device.open(() => {
                    const today = new Date();
                    this.printer
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
                        .raster(logo)
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
        });
    }
}

module.exports = InhouseOrdersController;
