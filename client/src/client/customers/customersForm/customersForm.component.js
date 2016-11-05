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
            return ['$log', '$timeout', '$state', '$stateParams', 'Customers', '$scope'];
        }
        constructor($log, $timeout, $state, $stateParams, Customers, $scope) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
            this.currentFormState = "name";
            this.$scope = $scope;
        }
        
        $onInit(){
            this.progressValue = 0;
            console.info(this.$stateParams);
            // this.nubmerTest = this.$stateParams.phoneNumber;
            
            this.Customers.get({
                id: 'template'
            }, (template)=>{
               this.inputForm = template;
               console.log(this.inputForm);
            });
            
            
            const test_id = '58152d8bb22d21700cb8d85f';
            this.Customers.get({
                id: test_id
            }, (customer)=>{
               // execute 
               console.log(customer);

               
               this.Customers.update({
                   id: test_id
               }, customer, ()=>{
                    this.Customers.query({}, (customers)=>{
                       // execute 
                       console.log(customers);
                    });
               });
              
            });
            
            // if (this.$stateParams.customer_id) {
            //     this.Customers.get({
            //         id: this.$stateParams.customer_id 
            //     }, (customer)=>{
            //       // execute 
            //     });
            // } else {
                
            // }
        }
        $onChanges(){
            if(this.customerId){
                // execute
            }
        }
        updateProgressVal() {
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
            // console.log("formModelCounts" + formModelCounts);
            // console.log("validFormModelCounts" + validFormModelCounts);
        }
        navigateForm(click) {
            const formStates = ["name", "address", "emergencyContact"];
            const index = formStates.indexOf(this.currentFormState);
            if (click == "next") {
                this.currentFormState = formStates[index + 1];
                console.log(this.currentFormState);
            }
            else if (click == "back") {
                this.currentFormState = formStates[index + -1];
                console.log(this.currentFormState);
            }
        }
    }
};
export default customersFormComponent;