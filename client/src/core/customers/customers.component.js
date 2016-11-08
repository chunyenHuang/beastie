import template from './customers.html';
import './customers.styl';

const customersComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class CustomersController {
        static get $inject() {
            return ['$log', '$timeout', 'Customers', '$state'];
        }
        constructor($log, $timeout, Customers, $state) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.Customers = Customers;
            this.$state = $state;
        }
        $onInit() {
            // this.resourceTest();
        }
        test(str) {
            console.log(str);
            if (str.length == 10) {
                this.phoneNumber = str;
                console.info("gonna get data from db");
                // for query, should add dialog to select one customer
                this.Customers.query({
                    phone: this.phoneNumber
                }, (customers) => {
                    if (customers['0']) {
                        console.log('customer checked in');
                        this.$state.go('core.customers.customersForm',
                        { 
                            customer_id: customers['0']._id, 
                            phoneNumber: this.phoneNumber
                        });
                    } else {
                        console.log('new customer');
                        this.$state.go('core.customers.customersForm');
                    }
                    // console.log(customers);
                    // console.log(typeof customers);
                    // console.log(customers['0']);
                    // if customers.resource
                }, () => {
                    console.log(this.phoneNumber);
                    this.$state.go('core.customers.customersForm',
                        { phoneNumber: this.phoneNumber });
                })
            }
        }
        resourceTest(){
            // https://docs.angularjs.org/api/ngResource/service/$resource
            this.Customers.query({
                phone: '6263805163'
            }, (users) => {
                console.log(users);
            });
            this.Customers.query({
                phone: '1111111111'
            }, (users) => {
                console.log(users);
            }, (err)=>{
                console.log(err);
            });
            // this.Customers.query({}, (users) => {
            //     console.warn(users);
            // });
            // this.Customers.get({
            //     id: '58163fb66ac4b6a263816f92'
            // }, (user) => {
            //     console.info(user);
            //     user.name = 'ChangedName';
            //     // user.$update();
            // });
        }
    }
};
export default customersComponent;
