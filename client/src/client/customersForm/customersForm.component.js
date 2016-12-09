import template from './customersForm.html';
import './customersForm.styl';

const customersFormComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class customersFormController {
        static get $inject() {
            return ['$log', '$timeout', '$state', '$stateParams', 'Customers', '$scope', 'Pets'];
        }
        constructor($log, $timeout, $state, $stateParams, Customers, $scope, Pets) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
            this.currentFormState = 'name';
            this.autofocus = 'name';
            this.$scope = $scope;
            this.Pets = Pets;
            this.states =
                ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
                'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
                'WY').split(' ').map((state) => {
                    return state;
                });
        }

        $onChanges() {
            this.getForm();
            this.getTemplate();
        }

        backToDashboard() {
            this.$state.go('client.dashboard', {
                customer_id: this.customer._id
            });
        }

        getTemplate() {
            this.Customers.get({
                id: 'template'
            }, (template) => {
                this.customerTemplate = template;
                this.emergencyContactTemplate = angular.copy(
                    this.customerTemplate.emergencyContact[0]
                );
            });
        }

        validateForm() {
            // const formStates = ['name', 'address', 'emergencyContact', 'review'];
            if (!this.customer) {
                return false;
            }
            switch (this.currentFormState) {
                case 'name':
                    if (!this.customer.firstname ||
                        this.customer.firstname == '' ||
                        !this.customer.lastname ||
                        this.customer.lastname == ''
                    ) {
                        return false;
                    }
                    break;
                case 'address':
                    for (let prop in this.customer.address) {
                        if (!this.customer.address[prop] ||
                            this.customer.address[prop] == ''
                        ) {
                            return false;
                        }
                    }
                    break;
                default:

            }
            return true;
        }
        _refresh(value) {
            this.$timeout(() => {
                value = value;
            });
        }
        getForm() {
            const createCustomerForm = new Promise(
                (resolve) => {
                    // this.$stateParams.customer_id ? let
                    this.Customers.get({
                        id: this.$stateParams.customer_id ?
                            this.$stateParams.customer_id : 'template'
                    }, (customer) => {
                        // sync from here
                        this.customer = customer;
                        // this.customer = template;
                        this.customer.phone = this.customer.phone ?
                            this.customer.phone : this.$stateParams.phoneNumber;
                        this.currentFormState = this.$stateParams.customer_id ?
                            'review' : 'name';
                        // this.currentFormState = 'emergencyContact';
                        this.updateProgressVal();
                        resolve();
                    });
                });

            createCustomerForm.then(() => {
                this.$timeout(this.updateProgressVal());
            });
        }

        updateProgressVal() {
            let formModelCounts = 0;
            let validFormModelCounts = 0;
            for (let val in this.customers_form) {
                if (!(/\$/).test(val)) {
                    formModelCounts += 1;
                    if (this.customers_form[val].$valid) {
                        validFormModelCounts += 1;
                    }
                }
            }
            this.progressValue = validFormModelCounts / formModelCounts * 100;
            this._refresh(this.progressValue);
        }

        navigateForm(click) {
            const formStates = [
                'name', 'address', 'emergencyContact', 'review'
            ];
            const index = formStates.indexOf(this.currentFormState);
            if (click == 'next') {
                if (index == formStates.length - 1) {
                    this.update();
                } else {
                    this.currentFormState = formStates[index + 1];
                    this.autofocus = formStates[index + 1];
                }
            } else if (click == 'back') {
                if (index == 0) {
                    // this.$state.go('core.customers');
                } else {
                    this.currentFormState = formStates[index + -1];
                    this.autofocus = formStates[index + -1];
                }
            }
        }

        addPerson() {
            let newContact = {
                name: null,
                relationship: null,
                phones: [null]
            };
            this.customer.emergencyContact
                .push(newContact);
        }

        removePerson(index) {
            this.customer.emergencyContact.splice(index, 1);
        }

        addPhone(person) {
            this.customer.emergencyContact[person].phones.push(null);
        }

        removePhone(person, phone) {
            this.customer.emergencyContact[person].phones.splice(phone, 1);
        }

        update() {
            if (this.customer._id) {
                this.Customers.update({
                    id: this.customer._id
                }, this.customer, (res) => {
                    console.log(res);
                    this.$state.go('client.dashboard', {
                        customer_id: this.customer._id
                    });
                });
            } else {
                console.log('new customer');
                this.Customers.save(this.customer, (res) => {
                    console.log(res);
                    this.$state.go('client.petsForm', {
                        customer_id: res._id
                    });
                });
            }
        }
    }
};
export default customersFormComponent;
