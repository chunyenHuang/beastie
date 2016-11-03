import inhouseOrdersComponent from './inhouseOrders.component';
import inhouseOrdersService from './services/inhouseOrders.service';

const inhouseOrdersModule = angular
    .module('beastie.inhouseOrders', [])
    .component('inhouseOrders', inhouseOrdersComponent)
    .service('InhouseOrders', inhouseOrdersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('inhouseOrders', {
                url: '/inhouseOrders?order_id',
                component: 'inhouseOrders'
            })
            .state('inhouseOrdersEdit', {
                url: '/inhouseOrdersEdit',
                component: 'inhouseOrdersEdit'
            });
    })
    .name;

export default inhouseOrdersModule;
