'use strict';

const escpos = require('escpos');
const device = new escpos.USB();
const printer = new escpos.Printer(device);
escpos.Image.load(__dirname + '/font-test.png', function(image){
  device.open(function(){
      const today = new Date();
    printer
    .font('A')
    .align('ct')
    .style('b')
    .size(2, 4)
    .text('A+ Pet Grooming')
    .text('--------------------')

    // .image(image, 's8')
    // .image(image, 'd8')
    // .image(image, 's24')
    // .image(image, 'd24')
    // .raster(image, 'dw')
    // .raster(image, 'dh')
    // .raster(image, 'dwdh')
    .raster(image)
    .text('------------------------')
    .align('ct')
    .style('b')
    .size(2, 4)
    .text(today.toLocaleDateString())
    .text(today.toLocaleTimeString())
    // .barcode('12345678', 'EAN8')
    .text(' ')
    .text(' ')
    .text(' ')
    .text(' ')
    .text(' ')
    .cut();
  });
});
//
// device.open(()=>{
//   const today = new Date();
//   printer
//     .lineSpace()
//     .font('A')
//     .align('ct')
//     .style('b')
//     .text('A+ Pet Grooming')
//     // .text('--------------------')
//     .align('lt')
//     .size(2, 4)
//  // .text('-----------00-----------')
//     .text('------------------------')
//     .text('          Item          ')
//     .text('------------------------')
//     .style('BU2')
//     .text('other information here')
//     .size(8, 8)
//     .text('中文測試到底可不可以', 'Big5')
//     .size(2, 4)
//     .text('line style test')
//     .style('b')
//     .size(2, 4)
//
//     .text('------------------------')
//     .align('ct')
//     .style('b')
//     .size(2, 4)
//     .text(today.toLocaleDateString())
//     .text(today.toLocaleTimeString())
//     // .barcode('12345678', 'EAN8')
//     .text(' ')
//     .text(' ')
//     .text(' ')
//     .text(' ')
//     .text(' ')
//     .cut();
//     // .qrimage('https://github.com/song940/node-escpos', function(err){
//     //   this.cut();
//     // });
// })
