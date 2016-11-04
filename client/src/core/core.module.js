import coreComponent from './core.component';
import users from './users';
import listItems from './listItems';
import pets from './pets';
import orders from './orders';
import inhouseOrders from './inhouseOrders';

import SharedUtil from './SharedUtil';

const coreModule = angular
    .module('beastie.core', [
        users,
        listItems,
        pets,
        orders,
        inhouseOrders
    ])
    .component('core', coreComponent)
    .service('SharedUtil', SharedUtil)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core', {
                url: '/',
                component: 'core'
            });
    })
    .config(($translatePartialLoaderProvider) => {
        'ngInject';
        $translatePartialLoaderProvider.addPart('core');
    })
    .name;

export default coreModule;
