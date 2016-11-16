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
                'Orders', 'Pets', 'SharedUtil', 'Customers'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders, Pets, SharedUtil, Customers
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
            this.Pets = Pets;
            this.getDayName = SharedUtil.getDayName;
            this.Customers = Customers;

            this.pets = {};
            this.customers = {};
        }
        
        setOrdersList(){
            const orders ={
                // checkedIn: [],
                checkedIn: {
                    'order_id1': {　/* resource entity */ },
                    'order_id2': {}
                },
                open: {
                    
                },
                close: {
                    
                },
                cancelled: {
                    
                }
            }
            
            orders['checkedIn'][order_id];
            
            orders['cancelled'][order_id] = orders['checkedIn'][order_id];
            delete orders['checkedIn'][order_id];
        }

        $onInit() {
            this.Orders.query({}, (orders) => {
                console.log('oninit');
                this.orders = orders;
                this.getPets();
                this.getCustomers();
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
                        console.log(this.pets);
                    });
                }
            });
        }
        
        getCustomers() {
            angular.forEach(this.orders, (order) => {
                if (!this.customers[order.customer_id]) {
                    this.Customers.get({
                        id: order.customer_id
                    }, (customer) => {
                        this.customers[order.customer_id] = customer;
                        console.log(this.customers);
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
            order.checkInAt = new Date();
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
