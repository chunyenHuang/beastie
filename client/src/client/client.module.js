import clientComponent from './client.component';
import clientService from './services/client.service';
// import customers from './customers';
// import components from './components';
// import filters from './filters';

const clientModule = angular
    .module('beastie.client', [
        // customers,

        ])
    .component('client', clientComponent)
    .service('Client', clientService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('client', {
                // abstract: true,
                url: '/client',
                component: 'client'
            });
    })
    .config(($translatePartialLoaderProvider) => {
        'ngInject';
        $translatePartialLoaderProvider.addPart('client');
    })

    .name;

export default clientModule;
