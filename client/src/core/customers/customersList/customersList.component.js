import template from './customersList.html';
import './customersList.styl';

const customersListComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class CustomersListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Customers', 'Task', 'CustomerDetailDialog'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Customers, Task, CustomerDetailDialog
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
            this.CustomerDetailDialog = CustomerDetailDialog;
            this.Task = Task;
        }

        $onInit() {
            this.Task.on();
            this.getCustomers();
        }

        getCustomers() {
            this.Customers.query({}, (customers) => {
                this.Task.off();
                this.customers = customers;
            });
        }

        select(customer) {
            this.CustomerDetailDialog({
                customer_id: customer._id,
                tab: 'customer'
            }).then(() => {
                this.$state.reload();
            }).catch(() => {
                this.$state.reload();
            });
        }

        updateCustomer(customer) {
            this.Customers.get({
                id: customer._id
            }).$promise.then((res) => {
                const pos = this.customers.findIndex((element) => {
                    return (element._id === res._id);
                });
                this.customers.splice(pos, 1, res);
            }, () => {});
        }
    }
};
export default customersListComponent;