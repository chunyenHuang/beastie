import template from './customersForm.html';
import './customersForm.styl';

const customersFormComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */
    class customersFormController {
        static get $inject() {
            return ['$log', '$timeout', '$state', '$stateParams', 'Customers', '$scope', 'Pets'];
        }
        constructor($log, $timeout, $state, $stateParams, Customers, $scope, Pets) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
            this.currentFormState = "name";
            this.$scope = $scope;
            this.Pets = Pets;
        }

        $onInit(){
            this.getForm();
            this.getTemplate();
            // this.customerForm = null;
            // this.currentFormState = 'emergencyContact';
            // this.progressValue = 0;

            //   this.Customers.update({
            //       id: test_id
            //   }, customer, ()=>{
            //         this.Customers.query({}, (customers)=>{
            //           // execute
            //           console.log(customers);
            //         });
            //   });

            // });

        }
        $onChanges(change){
            console.log(change);
            // if(this.customerId){
            //     // execute
            // }
        }
        getTemplate() {
            this.Customers.get({
                id: 'template'
            }, (template) => {
                this.customerTemplate = template;
                this.emergencyContactTemplate = angular.copy(
                    this.customerTemplate.emergencyContact[0]
                );
            })
        }
        _refresh(value){
            this.$timeout(()=>{
               value = value;
            });
        }
        getForm(){
            const createCustomerForm = new Promise(
                (resolve, reject) => {
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
                        console.log(this.$stateParams);
                        console.log(this.customer.phone);
                        this.currentFormState = this.$stateParams.customer_id ?
                            'review' : 'name';
                        // this.currentFormState = 'emergencyContact';
                        this.updateProgressVal();
                        resolve();
                    })
                })

            createCustomerForm
                .then(() => {
                    console.log('inside .then');
                    // console.log(form);
                    this.$timeout(this.updateProgressVal());
                })
                .catch((err) => console.log('rejected: ', err));
        }
        updateProgressVal() {
            // console.info(this.customers_form);
            let formModelCounts = 0;
            let validFormModelCounts = 0;
            // console.log(this.customers_form);
            for (let val in this.customers_form) {
                if(!(/\$/).test(val)) {
                    formModelCounts += 1;
                    if(this.customers_form[val].$valid) {
                        validFormModelCounts += 1;
                    }
                }
            }
            this.progressValue = validFormModelCounts/formModelCounts*100;
            console.log(this.progressValue);
            // console.log(this.customers_form);
            this._refresh(this.progressValue);
            // console.log("formModelCounts" + formModelCounts);
            // console.log("validFormModelCounts" + validFormModelCounts);
        }
        navigateForm(click) {
            const formStates = ["name", "address", "emergencyContact", "review"];
            const index = formStates.indexOf(this.currentFormState);
            if (click == "next") {
                if (index == formStates.length - 1) {
                    this.update();
                } else {
                    this.currentFormState = formStates[index + 1];
                }
                console.log(this.currentFormState);
            }
            else if (click == "back") {
                if (index == 0) {
                    // this.$state.go('core.customers');
                } else {
                    this.currentFormState = formStates[index + -1];
                }
                console.log(this.currentFormState);
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
        // there is some problem form data binding with this method....
        // addPerson2() {
        //     let newContact = angular.copy(this.customerTemplate.emergencyContact)
        //     console.log(newContact);
        //     this.customer.emergencyContact
        //         .push(newContact);
        // }
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
                }, this.customer, (res)=>{
                    console.log(res);
                    this.Pets.query({
                        customer_id: this.customer._id,
                    }, (results)=>{
                        console.info(results[0]);
                        this.$state.go('client.petsForm',
                            { pet_id: results[0]._id })
                    })
                });
            } else{
                console.log('new customer');
                this.Customers.save(this.customer, (res)=>{
                    console.log(res);
                    this.$state.go('client.petsForm',{
                        customer_id: res._id
                    });
                });
            }
        }
        // _findProp(obj, str, isTemplate) {
        //     const re = /\]*\.|\[/;
        //     let path = str.split(re);
        //     path[0] = isTemplate ? path[0] + 'Template' : path[0];
        //     // path[2] = isTemplate ? '0' : path[2];
        //     let target = obj;
        //     console.log(path);
        //     while (path.length > 0) {
        //         target = target[path[0]];
        //         path.shift();
        //     }

        //     return target;
        // }
        // pushArray(val) {
        //     // this.customerForm.emergencyContact[0].phones.push('123');

        //     this._findProp(this, val, false)
        //         .push(this._findProp(this, val, true)[0]);
        //     console.log(this._findProp(this, val, true)[0]);
        //     // console.log(this._findProp(this, val, true));
        //     // console.log(this._findProp(this, val, false));

        // }
        // popArray(val, index) {
        //     this._findProp(this, val, false)
        //         .splice(index, 1);
        //     // this.customerForm.emergencyContact[0].phones.splice(index,1)
        // }


    }
};
export default customersFormComponent;
