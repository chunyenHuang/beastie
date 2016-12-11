const path = require('path');
// const fs = require('fs');

const AbstractController = require('../../abstract/AbstractController.js');
class PrinterController extends AbstractController {
    constructor(){
        super();
        try {
            const escpos = require('escpos');
            this.escpos = escpos;
            this.device = new escpos.USB();
            this.printer = new escpos.Printer(this.device);
        } catch (err) {
            console.log('------------ Please Connect the Receipt Printer.');
        }

    }
    check(req, res) {
        if(
            !this.device ||
            !this.printer
        ) {
            res.statusCode = 500;
            res.json({
                message: 'Printer is not connected.'
            });
            return;
        }
        if(!this.device.open){
            res.statusCode = 500;
            res.json({
                message: 'Printer is not connected.'
            });
            return;
        }
        this.device.open((err) => {
            if(err){
                res.statusCode = 500;
                res.json({
                    message: 'Printer has error. Please reboot.'
                });
            } else {
                res.statusCode = 200;
                res.json({
                    message: 'Printer is Good.'
                });
            }
        });
    }
    test(req, res) {
        if(!this.device){
            res.statusCode = 500;
            res.json({
                message: 'Printer is not connected.'
            });
        } else {
            // this.device.open(() => {
            //     const today = new Date();
            //     this.printer
            //         .font('A')
            //         .align('ct')
            //         .style('b')
            //         .size(2, 4)
            //         .text(' ')
            //         .text('Welcome to Beastie')
            //         .text('歡迎使用比司吉寵物系統', 'Big5')
            //         .text('------------------------')
            //         // .raster(image)
            //         .text('------------------------')
            //         .text(today.toLocaleDateString())
            //         .text(today.toLocaleTimeString())
            //         .text(' ')
            //         .text(' ')
            //         .text(' ')
            //         .text(' ')
            //         .text(' ')
            //         .cut();
            //     res.sendStatus(200);
            // });

            const logoPath = path.join(global.root, 'logos/B1_256-01.png');
            console.log(logoPath);
            this.escpos.Image.load(logoPath, (image) => {
                this.device.open(() => {
                    const today = new Date();
                    this.printer
                        .font('A')
                        .align('ct')
                        .style('b')
                        .size(2, 4)
                        .text(' ')
                        .text('Welcome to Beastie')
                        .text('歡迎使用比司吉寵物系統', 'Big5')
                        .text('------------------------')
                        .raster(image)
                        .text('------------------------')
                        .text(today.toLocaleDateString())
                        .text(today.toLocaleTimeString())
                        .text(' ')
                        .text(' ')
                        .text(' ')
                        .text(' ')
                        .text(' ')
                        .cut();
                    res.sendStatus(200);
                });
            });
        }
    }

}

module.exports = PrinterController;
