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
            console.log(number);
            if (number.length == 10) {
                this.Customers.query({
                    phone: number
                }, (customers) => {
                    if (customers.length > 0) {
                        this.$state.go('client.dashboard',{
                            customer_id: customers[0]._id
                        });
                    } else {
                        this.$state.go(this.nextState, {
                            phoneNumber: number
                        });
                    }
                }, () => {
                    this.$state.go(this.nextState, {
                        phoneNumber: number
                    });
                });
            }
        }
    }
};
export default customersCheckInComponent;
