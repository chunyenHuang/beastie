import template from './orders.html';
import './orders.styl';

const ordersComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class OrdersController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Orders'];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
        }
    }
};
export default ordersComponent;
