import listItemsService from './services/listItems.service';

import listItemsComponent from './listItems.component';
import listItemsInhouseOrdersComponent from './listItemsInhouseOrders';

const listItemsModule = angular
    .module('beastie.listItems', [])
    .service('ListItems', listItemsService)
    .component('listItems', listItemsComponent)
    .component('listItemsInhouseOrders', listItemsInhouseOrdersComponent)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
        .state('listItems', {
            url: '/listItems',
            template: '<list-items layour="column" flex></list-items>'
        })
        .state('listItems.inhouseOrders', {
            url: '/inhouseOrders',
            template: '<list-items-inhouse-orders layout="column" flex></list-items-inhouse-orders>'
        });
    })
    .name;

export default listItemsModule;
