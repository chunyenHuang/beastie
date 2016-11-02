import template from './formCreate.html';
import './formCreate.styl';

const formCreateComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class FormCreateController {
        static get $inject() {
            return ['$log', '$timeout', '$state', '$stateParams', 'Customers'];
        }
        constructor($log, $timeout, $state, $stataParams, Customers) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stataParams = $stataParams;
            this.Customers = Customers;
        }
        
        $onInit(){
            const test_id = '58152d8bb22d21700cb8d85f';
            this.Customers.get({
                id: test_id
            }, (customer)=>{
               // execute 
               console.log(customer);
               Object.assign(customer, {
                   firstname: 'John',
                   lastname: 'Huang'
               });
               console.log(this.Customers)
               this.Customers.update({
                   id: test_id
               }, customer, ()=>{
                    this.Customers.query({
                    }, (customers)=>{
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
        
    }
};
export default formCreateComponent;