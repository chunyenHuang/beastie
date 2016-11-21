import template from './customersList.html';
import './customersList.styl';

const customersListComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class CustomersListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Customers'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Customers
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
        }
        $onInit() {
            this.Customers.query({}, (customers) => {
                this.customers = customers;
                console.log(this.customers);
            });
        }

        update(customer) {
            if (!customer._id) {
                this.create(customer);
            }
            customer.$update({
                id: customer._id
            }, (res) => {
                console.log(res);
            });
        }

        create(customer) {
            this.Customers.save(customer, (res) => {
                console.log(res);
            });
        }

        getTemplate(callback) {
            this.Users.get({
                id: 'template'
            }, callback);
        }

    }
};
export default customersListComponent;
