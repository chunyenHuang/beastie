import template from './customers.html';
import './customers.styl';

const customersComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class CustomersController {
        static get $inject() {
            return ['$log', '$timeout', 'Customers', '$state'];
        }
        constructor($log, $timeout, Customers, $state) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.Customers = Customers;
            this.$state = $state;
        }
        $onInit() {
            this.$state.go('core.customers.list');
            // this.resourceTest();
        }
    }
};
export default customersComponent;
