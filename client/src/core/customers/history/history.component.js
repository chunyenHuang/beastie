import template from './history.html';
import './history.styl';

const historyComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class historyController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams',
                'Orders',
                'Transactions'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams,
            Orders,
            Transactions
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
            this.Transactions = Transactions;
        }
        $onChanges() {
            if (this.customerId) {
                this.history = [];
                this.orders = [];
                this.Transactions.query({
                    customer_id: this.customerId
                }).$promise.then((transactions) => {
                    this.history = transactions;
                    transactions.forEach((tran) => {
                        if (tran.order_id) {
                            this.Orders.get({
                                id: tran.order_id
                            }).$promise.then((order) => {
                                this.orders.push(order);
                            }, () => {});
                        }
                    });
                }, () => {});
            }
        }

        findOrder(transaction) {
            return this.orders.find((order) => {
                return (order._id === transaction.order_id);
            });
        }
    }
};
export default historyComponent;