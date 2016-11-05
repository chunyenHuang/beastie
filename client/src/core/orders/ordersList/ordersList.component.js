import template from './ordersList.html';
import './ordersList.styl';

const ordersListComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class OrdersListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Orders', 'Pets', 'SharedUtil'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders, Pets, SharedUtil
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
            this.Pets = Pets;
            this.getDayName = SharedUtil.getDayName;

            this.pets = {};
        }

        $onInit() {
            this.Orders.query({}, (orders) => {
                console.log('oninit');
                this.orders = orders;
                this.getPets();
                this.$timeout(() => {
                    this.orders = this.orders;
                }, 20);
            });
        }

        getPets() {
            angular.forEach(this.orders, (order) => {
                if (!this.pets[order.pet_id]) {
                    this.Pets.get({
                        id: order.pet_id
                    }, (pet) => {
                        this.pets[order.pet_id] = pet;
                    });
                }
            });
        }

        edit(order_id) {
            this.$state.go('core.orders.form', {
                order_id: order_id
            });
        }

        inhouseOdrer(order_id) {
            this.$state.go('core.inhouseOrders', {
                order_id: order_id
            });
        }

        checkIn(order){
            order.checkIn = new Date();
            this.update(order);
        }

        update(order){
            this.Orders.update({
                id: order._id
            }, order, ()=>{
                console.log('updated');
            });
        }
    }
};
export default ordersListComponent;
