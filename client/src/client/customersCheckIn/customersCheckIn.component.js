import template from './customersCheckIn.html';
import './customersCheckIn.styl';

const customersCheckInComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class CustomersCheckInController {
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
            this.nextState = $state.current.name.replace('customersCheckIn', 'customersForm');
        }

        checkIn(number) {
            if (number.length == 10) {
                this.Customers.checkIn({
                    phone: number
                }, (res) => {
                    this.$state.go('client.dashboard', {
                        customer_id: res[0]._id || res[0].customer_id
                    });
                }, (err) => {
                    if (err.status == 400) {
                        this.$state.go('client.customersForm', {
                            phoneNumber: number
                        });
                    } else {
                        this.$state.go('client.dashboard', {
                            customer_id: err.data.customer_id
                        });
                    }
                });
            }
        }
    }
};
export default customersCheckInComponent;
