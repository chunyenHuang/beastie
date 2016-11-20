import template from './ordersForm.html';
import './ordersForm.styl';

const ordersFormComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class OrdersFormController {
        static get $inject() {
            return [
                '$scope', '$timeout', '$state', '$stateParams',
                'Orders', 'Customers', 'Pets', 'SharedUtil', 'ListItems'
            ];
        }
        constructor(
            $scope, $timeout, $state, $stateParams,
            Orders, Customers, Pets, SharedUtil, ListItems
        ) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
            this.Customers = Customers;
            this.Pets = Pets;
            this.getDayName = SharedUtil.getDayName;
            this.ListItems = ListItems;
            this.scheduleTime = [9, 0];
            this.today = new Date();
            this.scheduleDate = {
                min: new Date(
                    this.today.getFullYear(),
                    this.today.getMonth(),
                    this.today.getDate()
                ),
                max: new Date(
                    this.today.getFullYear(),
                    this.today.getMonth() + 3,
                    this.today.getDate()
                )
            };
            this.yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
            this.tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

            $scope.$watch('$ctrl.order.scheduleAt', (value) => {
                if (this.order && this.order.scheduleAt) {
                    this.getOrderForDate(this.order.scheduleAt);
                }
            }, true);
        }

        $onInit() {
            this.defaultDate = null;
            if (!this.$stateParams.order_id &&
                !this.$stateParams.customer_id
            ) {
                return this.$state.go('core.orders');
            }
            this.getServicesListItems();
            this.setOrder();
        }

        getServicesListItems() {
            this.ListItems.query({
                type: 'services'
            }, (results) => {
                this.services = results[0].items;
            });
        }

        setOrder() {
            console.log(this.$stateParams);
            if (this.$stateParams.order_id) {
                console.warn('edit order');
                // edit order
                this.Orders.get({
                    id: this.$stateParams.order_id
                }, (order) => {
                    order.scheduleAt = new Date(order.scheduleAt);
                    this.order = order;
                    this.customer_id = this.order.customer_id;
                    this.getCustomer(this.customer_id);
                    this.getPet(this.order.pet_id);
                    this.defaultDate = new Date(this.order.scheduleAt);
                    console.log(this.defaultDate);
                    this.getOrderForDate(this.order.scheduleAt);
                });
            } else if (this.$stateParams.customer_id) {
                console.warn('new order');
                // new order
                this.setTemplate();
                this.customer_id = this.$stateParams.customer_id;
                this.getPets();
                this.getCustomer(this.$stateParams.customer_id);
                this.scheduleTimeIsAm = true;
                const today = new Date();
                today.setHours(9, 0, 0);
                this.defaultDate = new Date(today);
                console.info(this.defaultDate);
            } else {
                // new customer
                this.defaultDate = null;
            }
        }

        getCustomer(customer_id) {
            this.Customers.get({
                id: customer_id
            }, (customer) => {
                this.customer = customer;
            });
        }

        getPet(pet_id) {
            this.Pets.get({
                id: pet_id
            }, (pet) => {
                this.pets = [pet];
                this.candidates = (this.candidates) ? this.candidates : {};
                angular.forEach(this.pets, (pet) => {
                    this.candidates[pet._id] = true;
                });
            });
        }

        getPets() {
            this.Pets.query({
                customer_id: this.customer_id
            }, (pets) => {
                this.pets = pets;
                this.candidates = (this.candidates) ? this.candidates : {};
                angular.forEach(this.pets, (pet) => {
                    this.candidates[pet._id] = true;
                });
            });
        }

        setTemplate() {
            this.Orders.get({
                id: 'template'
            }, (template) => {
                console.log(template);
                this.order = template;
            });
        }

        noTuesday(date) {
            const day = date.getDay();
            return day != 2;
        }

        displayWithZero(val) {
            if (val < 10) {
                val = '0' + val.toString();
            }
            return val;
        }

        changeTime(type, val) {
            switch (type) {
                case 'hour':
                    this.scheduleTime[0] += val;
                    this.scheduleTime[0] = (this.scheduleTime[0] < 1) ? 12 : this.scheduleTime[0];
                    this.scheduleTime[0] = (this.scheduleTime[0] > 12) ? 1 : this.scheduleTime[0];
                    break;
                case 'minute':
                    this.scheduleTime[1] += val;
                    this.scheduleTime[1] = (this.scheduleTime[1] < 0) ? 45 : this.scheduleTime[1];
                    this.scheduleTime[1] = (this.scheduleTime[1] > 59) ? 0 : this.scheduleTime[1];
                    break;
                default:

            }

            return this.setNewHour();
        }

        changeDate() {
            this.setNewHour();
            this.getOrderForDate(this.order.scheduleAt);
        }

        getOrderForDate(date) {
            const queryDate = new Date(date);
            this.Orders.getByDate({
                date: queryDate
            }, (res) => {
                this.selectedDateOrders = res;
            });
        }

        setNewHour() {
            if (!this.order) {
                return;
            }
            if (!this.order.scheduleAt) {
                return;
            }
            console.log(this.order.scheduleAt);
            if (this.order.scheduleAt.getHours() <= 12) {
                this.scheduleTimeIsAm = true;
            }
            const hour = (this.scheduleTimeIsAm) ? this.scheduleTime[0] : this.scheduleTime[0] + 12;
            const minute = parseInt(this.scheduleTime[1]);
            console.log();
            this.order.scheduleAt.setHours(
                hour, minute, 0
            );
            console.log('hour', hour);
        }

        submitOrder() {
            this.isSubmitting = true;
            let newOrder;
            for (let prop in this.candidates) {
                if (this.candidates[prop]) {
                    newOrder = Object.assign({}, this.order, {
                        pet_id: prop,
                        customer_id: this.customer_id
                    });
                    break;
                }
            }
            if (newOrder) {
                delete newOrder['$promise'];
                delete newOrder['$resolved'];
                if (newOrder._id) {
                    this.Orders.update({
                        id: newOrder._id
                    }, newOrder, () => {
                        this.candidates[newOrder.pet_id] = false;
                        return this.submitOrder();
                    }, (err) => {
                        console.log(err);
                    });
                } else {
                    this.Orders.save(newOrder, (res) => {
                        console.log(res);
                        this.candidates[newOrder.pet_id] = false;
                        return this.submitOrder();
                    }, (err) => {
                        console.log(err);
                    });
                }
            } else {
                this.$state.go('core.orders.list');
            }
        }
    }
};
export default ordersFormComponent;
