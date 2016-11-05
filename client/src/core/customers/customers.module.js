import customersComponent from './customers.component';
import customersFormComponent from './customersForm';
import customersService from './services/customers.service';

const customersModule = angular
    .module('beastie.core.customers', [])
    .component('customers', customersComponent)
    .component('customersForm', customersFormComponent)
    .service('Customers', customersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('customers', {
                // abstract: true,
                url: '/customers',
                // component: 'customers',
                template: '<customers layout="column" flex></customers>',
                params: {
                    phoneNumber: '',
                }
            })
            .state('customers.customersForm', {
                url: '/customers-form?customer_id',
                template: '<customers-form layout="column" flex></customers-form>',
                // component: 'customersForm',
                params: {
                    phoneNumber: '',
                }
            })
            ;
    })
    .name;

export default customersModule;
