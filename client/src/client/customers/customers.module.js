import customersComponent from './customers.component';
import customersFormComponent from './customersForm';
import customersService from './services/customers.service';

const customersModule = angular
    .module('beastie.client.customers', [])
    .component('customers', customersComponent)
    .component('customersForm', customersFormComponent)
    .service('Customers', customersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('customers', {
                // abstract: true,
                url: '/customers',
                component: 'customers',
                params: {
                    phoneNumber: '',
                }
            })
            .state('customers.customersForm', {
                url: '/customers-form?customer_id',
                component: 'customersForm',
                params: {
                    phoneNumber: '',
                }
            })
            ;
    })
    .name;

export default customersModule;
