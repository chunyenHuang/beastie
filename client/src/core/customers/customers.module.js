import customersComponent from './customers.component';
import customersFormComponent from './customersForm';
import customersCheckInComponent from './customersCheckIn';
import customersListComponent from './customersList';

import customersService from './services/customers.service';

const customersModule = angular
    .module('beastie.core.customers', [])
    .component('customers', customersComponent)
    .component('customersCheckIn', customersCheckInComponent)
    .component('customersForm', customersFormComponent)
    .component('customersList', customersListComponent)
    .service('Customers', customersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.customers', {
                // abstract: true,
                url: '/customers',
                // component: 'customers',
                template: '<customers layout="column" flex></customers>',
                params: {
                    phoneNumber: '',
                }
            })
            .state('core.customers.list', {
                url: '/list',
                template: '<customers-list layout="column" flex></customers-list>'
            })
            .state('core.customers.customersForm', {
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
