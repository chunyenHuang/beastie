import inhouseOrdersComponent from './inhouseOrders.component';
import inhouseOrdersDialogService from './inhouseOrdersDialog.service';

import inhouseOrdersService from './services/inhouseOrders.service';

const inhouseOrdersModule = angular
    .module('beastie.inhouseOrders', [])
    .component('inhouseOrders', inhouseOrdersComponent)
    .service('InhouseOrdersDialog', inhouseOrdersDialogService)
    .service('InhouseOrders', inhouseOrdersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.inhouseOrders', {
                url: '/inhouseOrders?order_id',
                template: '<inhouse-orders layout="column" flex></inhouse-orders>'
            });
    })
    .name;

export default inhouseOrdersModule;
