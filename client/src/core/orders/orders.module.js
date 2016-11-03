import ordersComponent from './orders.component';
import ordersService from './services/orders.service';

const ordersModule = angular
    .module('beastie.orders', [])
    .component('orders', ordersComponent)
    .service('Orders', ordersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('orders', {
                url: '/orders',
                component: 'orders'
            });
    })
    .name;

export default ordersModule;
