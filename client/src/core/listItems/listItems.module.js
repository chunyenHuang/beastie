import listItemsComponent from './listItems.component';
import listItemsService from './services/listItems.service';

const listItemsModule = angular
    .module('beastie.listItems', [])
    .component('listItems', listItemsComponent)
    .service('ListItems', listItemsService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('listItems', {
                url: '/listItems',
                component: 'listItems'
            });
    })
    .name;

export default listItemsModule;
