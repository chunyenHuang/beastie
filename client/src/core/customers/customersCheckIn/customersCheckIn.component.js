import template from './customersCheckIn.html';
import './customersCheckIn.styl';

const customersCheckInComponent = {
    template,
    bindings: {
    },
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
        test(str) {
            if (str.length == 10) {
                this.phoneNumber = str;
                this.Customers.query({
                    phone: this.phoneNumber
                }, (customers) => {
                    if (customers['0']) {
                        this.$state.go(this.nextState, {
                            customer_id: customers['0']._id,
                            phoneNumber: this.phoneNumber
                        });
                    } else {
                        this.$state.go(this.nextState);
                    }
                }, () => {
                    this.$state.go(this.nextState, {
                        phoneNumber: this.phoneNumber
                    });
                });
            }
        }
    }
};
export default customersCheckInComponent;
