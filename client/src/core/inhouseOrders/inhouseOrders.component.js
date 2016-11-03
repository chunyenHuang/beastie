import template from './inhouseOrders.html';
import './inhouseOrders.styl';

const inhouseOrdersComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class InhouseOrdersController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'InhouseOrders', 'ListItems', 'Orders'
            ];
        }
        constructor($log, $timeout, $state, $stateParams, InhouseOrders, ListItems, Orders) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.InhouseOrders = InhouseOrders;
            this.ListItems = ListItems;
            this.Orders = Orders;
        }

        $onInit() {
            this.inhouseOrders = {};
            this.order_id = this.$stateParams.order_id;

            this.Orders.get({
                id: this.order_id
            }, (order) => {
                this.order = order;
                this.ListItems.query({
                    type: 'inhouseOrders'
                }, (datas) => {
                    this.list = datas[0].items;
                    this.populateInhouseOrders();
                });
            });
        }

        reset() {
            this.populateInhouseOrders('reset');
        }

        populateInhouseOrders(reset) {
            angular.forEach(this.list, (listItem) => {
                let value = [];
                if (this.order.inhouseOrders && this.order.inhouseOrders[listItem.name]) {
                    value = this.order.inhouseOrders[listItem.name].value;
                }
                if (reset) {
                    value = [];
                }
                this.inhouseOrders[listItem.name] = {
                    type: listItem.type,
                    multiple: listItem.multiple,
                    name: listItem.name,
                    zhName: listItem.zhName,
                    value: value
                };
            });
        }

        assignToOrder(key, item) {
            if (this.inhouseOrders[key].multiple) {
                if (this.isInOrder(key, item)) {
                    this.inhouseOrders[key].value.splice(this.findInOrder(key, item), 1);
                } else {
                    this.inhouseOrders[key].value.push(item);
                }
            } else {
                this.inhouseOrders[key].value = [item];
            }
            this.$timeout(() => {
                this.inhouseOrders = this.inhouseOrders;
            });
        }

        findInOrder(key, item) {
            const value = this.inhouseOrders[key].value;
            for (var i = 0; i < value.length; i++) {
                if (
                    value[i].name == item.name &&
                    value[i].zhName == item.zhName
                ) {
                    return i;
                }
            }
            return -1;
        }

        isInOrder(key, item) {
            if (!this.inhouseOrders || !key || !item) {
                return false;
            } else {
                return (this.findInOrder(key, item) > -1) ? true : false;
            }
        }

        submit() {
            this.order.inhouseOrders = this.inhouseOrders;
            this.order.$update({
                id: this.order_id
            }, (res) => {
                console.info(res);
                this.formatOrderForm();
            }, (err) => {
                console.error(err);
            });
        }

        formatOrderForm() {
            this.format = {};
            for (var prop in this.inhouseOrders) {
                if (this.inhouseOrders[prop].value.length > 0) {
                    this.format[prop] = this.inhouseOrders[prop].value;
                }
            }
        }
    }
};
export default inhouseOrdersComponent;
