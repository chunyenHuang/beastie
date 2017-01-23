const path = require('path');
const PrinterController = require('../printer/printer.controller.js');
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
        req.body.checkInNumber = req.body.checkInNumber || ' ';
        req.body.order_id = req.body.order_id || ' ';
        req.body.customerName = req.body.customerName || ' ';
        req.body.customerPhone = req.body.customerPhone || ' ';
        if (req.body.customerPhone.length == 10) {
            let phone = '(';
            for (var i = 0; i < req.body.customerPhone.length; i++) {
                phone = phone + req.body.customerPhone[i].toString();
                switch (i) {
                    case 2:
                        phone = phone + ') ';
                        break;
                    case 5:
                        phone = phone + '-';
                        break;
                    default:
                }
            }
            req.body.customerPhone = phone;
        }
        req.body.petName = req.body.petName || ' ';
        req.body.petInfo = req.body.petInfo || ' ';
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
        const logoPath = path.join(global.root, 'logos/B1_72-01.png');
        const rush = (req.body.isRush == 'true' || req.body.isRush == true) ? 'RUSH' : '';
        this.escpos.Image.load(logoPath, (logo) => {
            this.escpos.Image.load(req.newPath, (image) => {
                this.device = new this.escpos.USB();
                this.printer = new this.escpos.Printer(this.device);
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
                        .text(' ')
                        .text(req.body.checkInNumber)
                        .text(rush)
                        .text(' ')
                        .text('------------------------')
                        .raster(image)
                        .text(' ')
                        .text(' ')
                        .text('[ customer ]')
                        .text(' ')
                        .text(req.body.customerName)
                        .text(req.body.customerPhone)
                        .text(' ')
                        .text('[ pet ]')
                        .text(' ')
                        .text(req.body.petName)
                        .text(req.body.petInfo)
                        .text(' ')
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

                    next();
                });
            });
        });
    }
}

module.exports = InhouseOrdersController;
