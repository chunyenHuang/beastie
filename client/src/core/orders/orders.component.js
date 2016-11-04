import template from './orders.html';
import './orders.styl';

const ordersComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class OrdersController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
        }

        $onInit() {
            this.$state.go('orders.list');
        }
    }
};
export default ordersComponent;
