const path = require('path');
const escpos = require('escpos');
const device = new escpos.USB();
const printer = new escpos.Printer(device);

const AbstractController = require('../../abstract/AbstractController.js');
class PrinterController extends AbstractController {
    constructor() {
        super();
    }
    check(req, res) {
        if (!device) {
            console.log('No USB devices.');
            res.statusCode = 500;
            res.json({
                message: 'No USB devices.'
            });
            return;
        }
        if (!printer) {
            console.log('No Printer devices.');
            res.statusCode = 500;
            res.json({
                message: 'No Printer devices.'
            });
            return;
        }
        if (!device.open) {
            console.log('Can not open device.');
            res.statusCode = 500;
            res.json({
                message: 'Can not open device.'
            });
            return;
        }
        device.openAll((err) => {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.json({
                    message: 'Device.open has error. Please reboot.'
                });
            }
            let devices = device.getDevices();
            for (let i = 0; i < devices; i++) {
                console.log(devices[i]);
                console.log('Printing on device', (i + 1));
                setTimeout(() => {
                    device.setDevice(i);
                    printer.font('a')
                        .align('ct')
                        .style('bu')
                        .size(1, 1)
                        .text('This is the printer #' + (i + 1))
                        .cut();
                }, 500 * i);
            }

            setTimeout(() => {
                device.closeAll(() => {
                    console.log('Closed all');
                })
            }, 1000 * devices);
        });

        // device.open((err) => {
        //     if (err) {
        //         console.log(err);
        //         res.statusCode = 500;
        //         res.json({
        //             message: 'Printer has error. Please reboot.'
        //         });
        //     } else {
        //         res.statusCode = 200;
        //         res.json({
        //             message: 'Printer is Good.'
        //         });
        //     }
        // });
    }

    test(req, res) {
        device.open(() => {
            const today = new Date();
            printer
                .font('A')
                .align('ct')
                .style('b')
                .size(2, 4)
                .text(' ')
                .text('Welcome to Beastie')
                .text('歡迎使用比司吉寵物系統', 'Big5')
                .text('------------------------')
                // .raster(image)
                .text('------------------------')
                .text(today.toLocaleDateString())
                .text(today.toLocaleTimeString())
                .text(' ')
                .text(' ')
                .text(' ')
                .text(' ')
                .text(' ')
                .cut();
            console.log('printing test prints.');
            res.sendStatus(200);
        });
    }

}

module.exports = PrinterController;
