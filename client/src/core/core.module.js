import coreComponent from './core.component';
import users from './users';
import customers from './customers';
import listItems from './listItems';
import pets from './pets';
import orders from './orders';
import inhouseOrders from './inhouseOrders';
import settings from './settings';
import printer from './printer';
import services from './services';
import signatures from './signatures';
import albums from './albums';

import components from './components';
import filters from './filters';


const coreModule = angular
    .module('beastie.core', [
        users,
        customers,
        listItems,
        pets,
        orders,
        inhouseOrders,
        settings,
        printer,
        services,
        signatures,
        albums,

        components,
        filters
    ])
    .component('core', coreComponent)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core', {
                url: '/core',
                template: '<core layout="column" flex></core>'
                    // component: 'core'
            });
    })
    .config(($translatePartialLoaderProvider) => {
        'ngInject';
        $translatePartialLoaderProvider.addPart('core');
    })
    .name;

export default coreModule;
