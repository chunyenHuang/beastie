import printerComponent from './printer.component';
import printerService from './services/printer.service';

const printerModule = angular
    .module('beastie.printer', [])
    .component('printer', printerComponent)
    .service('Printer', printerService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.printer', {
                url: '/printer',
                component: 'printer'
                // template: ''

            });
    })
    .name;

export default printerModule;
