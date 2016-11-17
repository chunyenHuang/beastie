const path = require('path');
const fs = require('fs');
const escpos = require('escpos');

const AbstractController = require('../../abstract/AbstractController.js');
class PrinterController extends AbstractController {
    constructor(){
        super();
        try {
            this.escpos = escpos;
            this.device = new escpos.USB();
            this.printer = new escpos.Printer(this.device);
        } catch (err) {
            console.log('-----------------------------------');
            console.log('Please Connect the Receipt Printer.');
            console.log('-----------------------------------');
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
            this.device.open(() => {
                const today = new Date();
                this.printer
                    .font('A')
                    .align('ct')
                    .style('b')
                    .size(2, 4)
                    .text(' ')
                    .text('Welcome to Beastie')
                    .text('------------------------')
                    .text('Test Print')
                    .text('1234567890')
                    .text('一二三四五六七八九十', 'Big5')
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
        }
    }

}

module.exports = PrinterController;
