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
            // console.log(this.nextState);
        }

        $onInit() {
            console.log('customer check in');
        }

        checkIn(number) {
            // console.log(number);
            if (number.length == 10) {
                this.Customers.checkIn({
                    phone: number
                }, (res) => {
                    console.log(res);
                    this.$state.go('client.dashboard', {
                        customer_id: res._id || res.customer_id
                    });
                }, (err) => {
                    // console.log(err);
                    // console.log(err.status);
                    if (err.status == 400) {
                        // new customer
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
