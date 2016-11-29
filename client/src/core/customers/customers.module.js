import customersComponent from './customers.component';
import customersListComponent from './customersList';
import customersService from './services/customers.service';
import CustomerDetailDialogService from './customerDetailDialog.service';

const customersModule = angular
    .module('beastie.core.customers', [])
    .component('customers', customersComponent)
    .component('customersList', customersListComponent)
    .service('Customers', customersService)
    .service('CustomerDetailDialog', CustomerDetailDialogService)

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
                url: '/customers-form?customer_id&phoneNumber',
                template: '<customers-form layout="column" flex></customers-form>',
                // component: 'customersForm',
                // params: {
                //     phoneNumber: '',
                // }
            })
            ;
    })
    .name;

export default customersModule;
