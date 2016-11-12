import clientComponent from './client.component';
import clientService from './services/client.service';
// import customers from './customers';
// import components from './components';
// import filters from './filters';
import signature from './signature';

const clientModule = angular
    .module('beastie.client', [
        // customers,
        signature
    ])
    .component('client', clientComponent)
    .service('Client', clientService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('client', {
                url: '/client',
                component: 'client'
            })
            .state('client.customersCheckIn', {
                url: '/customersCheckIn',
                component: 'customersCheckIn'
            })
            .state('client.customersForm', {
                url: '/customersForm',
                component: 'customersForm'
            })
            ;
    })
    .config(($translatePartialLoaderProvider) => {
        'ngInject';
        $translatePartialLoaderProvider.addPart('client');
    })

    .name;

export default clientModule;
