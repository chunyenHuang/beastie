import clientComponent from './client.component';
import clientService from './services/client.service';

const clientModule = angular
    .module('beastie.client', [])
    .component('client', clientComponent)
    .service('Client', clientService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('client', {
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
