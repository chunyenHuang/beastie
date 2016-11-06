import inhouseOrdersComponent from './inhouseOrders.component';
import inhouseOrdersService from './services/inhouseOrders.service';

const inhouseOrdersModule = angular
    .module('beastie.inhouseOrders', [])
    .component('inhouseOrders', inhouseOrdersComponent)
    .service('InhouseOrders', inhouseOrdersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.inhouseOrders', {
                url: '/inhouseOrders?order_id',
                component: 'inhouseOrders'
            });
    })
    .name;

export default inhouseOrdersModule;