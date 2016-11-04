import customersComponent from './customers.component';
import formCreateComponent from './formCreate';
import formReviewComponent from './formReview';
import customersService from './services/customers.service';

const customersModule = angular
    .module('beastie.client.customers', [])
    .component('customers', customersComponent)
    .component('formCreate', formCreateComponent)
    .component('formReview', formReviewComponent)
    .service('Customers', customersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('customers', {
                // abstract: true,
                url: '/customers',
                component: 'customers'
            })
            .state('customers.formCreate', {
                url: '/form-create?customer_id',
                component: 'formCreate'
            })
            .state('customers.formReview', {
                url: '/form-review',
                component: 'formReview'
            });
    })
    .name;

export default customersModule;
