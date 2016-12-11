import ordersComponent from './orders.component';
import ordersFormComponent from './ordersForm';
import ordersListComponent from './ordersList';
import previousOrdersDialogService from './previousOrdersDialog.service';
import ServicesDialogService from './servicesDialog.service';
import ordersService from './services/orders.service';
import chooseServiceDialogService from './chooseServiceDialog.service'

const ordersModule = angular
    .module('beastie.orders', [])
    .component('orders', ordersComponent)
    .component('ordersForm', ordersFormComponent)
    .component('ordersList', ordersListComponent)
    .service('PreviousOrdersDialog', previousOrdersDialogService)
    .service('ServicesDialog', ServicesDialogService)
    .service('chooseServiceDialog', chooseServiceDialogService)
    .service('Orders', ordersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.orders', {
                url: '/orders',
                // component: 'orders'
                template: '<orders layout="column" flex></orders>'
            })
            .state('core.orders.list', {
                url: '/list?type&#',
                // component: 'orders'
                template: '<orders-list layout="column" flex></orders-list>'
            
            })
            .state('core.orders.form', {
                url: '/form?customer_id&order_id',
                // component: 'orders'
                template: '<orders-form layout="column" flex></orders-form>'
            });
    })
    .name;

export default ordersModule;
