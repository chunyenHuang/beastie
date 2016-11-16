import listItemsService from './services/listItems.service';

import listItemsComponent from './listItems.component';
import listItemsInhouseOrdersComponent from './listItemsInhouseOrders';
import listItemsServicesComponent from './listItemsServices';
import listItemsWaiversComponent from './listItemsWaivers';
import listItemsVaccinationsComponent from './listItemsVaccinations';
import listItemsBreedsComponent from './listItemsBreeds';
import listItemsColorsComponent from './listItemsColors';

const listItemsModule = angular
    .module('beastie.listItems', [])
    .service('ListItems', listItemsService)
    .component('listItems', listItemsComponent)
    .component('listItemsInhouseOrders', listItemsInhouseOrdersComponent)
    .component('listItemsServices', listItemsServicesComponent)
    .component('listItemsWaivers', listItemsWaiversComponent)
    .component('listItemsVaccinations', listItemsVaccinationsComponent)
    .component('listItemsBreeds', listItemsBreedsComponent)
    .component('listItemsColors', listItemsColorsComponent)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
        .state('core.listItems', {
            url: '/listItems',
            template: '<list-items layour="column" flex></list-items>'
        })
        .state('core.listItems.inhouseOrders', {
            url: '/inhouseOrders',
            template: '<list-items-inhouse-orders layout="column" flex></list-items-inhouse-orders>'
        })
        .state('core.listItems.services', {
            url: '/services',
            template: '<list-items-services layout="column" flex></list-items-services>'
        })
        .state('core.listItems.waivers', {
            url: '/waivers',
            template: '<list-items-waivers layout="column" flex></list-items-waivers>'
        })
        .state('core.listItems.vaccinations', {
            url: '/vaccinations',
            template: '<list-items-vaccinations layout="column" flex></list-items-vaccinations>'
        })
        .state('core.listItems.breeds', {
            url: '/breeds',
            template: '<list-items-breeds layout="column" flex></list-items-breeds>'
        })
        .state('core.listItems.colors', {
            url: '/colors',
            template: '<list-items-colors layout="column" flex></list-items-colors>'
        })
        ;

    })
    .name;

export default listItemsModule;
