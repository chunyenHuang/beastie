import coreComponent from './core.component';
import users from './users';
import listItems from './listItems';
import orders from './orders';
import inhouseOrders from './inhouseOrders';


const coreModule = angular
    .module('beastie.core', [
        users,
        listItems,
        orders,
        inhouseOrders
    ])
    .component('core', coreComponent)
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
