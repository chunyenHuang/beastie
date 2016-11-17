import template from './printer.html';
import './printer.styl';

const printerComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class PrinterController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Printer'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Printer
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Printer = Printer;
        }
        $onInit() {
            this.isConnected = false;

            this.Printer.get({}, (res) => {
                this.isConnected = true;
                this.message = res.message;
            }, (err) => {
                console.log(err);
                this.message = 'Printer is not connected';
            });
        }
        test() {
            this.Printer.test({}, (res) => {
                console.log(res);
            });
        }
    }
};
export default printerComponent;
