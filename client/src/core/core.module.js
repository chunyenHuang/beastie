import coreComponent from './core.component';
import users from './users';
import customers from './customers';
import listItems from './listItems';
import pets from './pets';
import orders from './orders';
import inhouseOrders from './inhouseOrders';
import components from './components';
import filters from './filters';

import SharedUtil from './SharedUtil';

const coreModule = angular
    .module('beastie.core', [
        users,
        customers,
        listItems,
        pets,
        orders,
        inhouseOrders,
        components,
        filters,
    ])
    .component('core', coreComponent)
    .service('SharedUtil', SharedUtil)
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
