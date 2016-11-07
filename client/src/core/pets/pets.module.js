import petsComponent from './pets.component';
import petsListComponent from './petsList';
import petsFormComponent from './petsForm';

import petsService from './services/pets.service';

const petsModule = angular
    .module('beastie.pets', [])
    .component('pets', petsComponent)
    .component('petsList', petsListComponent)
    .component('petsForm', petsFormComponent)
    .service('Pets', petsService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.pets', {
                url: '/pets',
                // component: 'pets'
                template: '<pets flex layout="column"></pets>'
            })
            .state('core.pets.list', {
                url: '/list',
                // component: 'pets'
                template: '<pets-list flex layout="column"></pets-list>'
            })
            .state('core.pets.form', {
                url: '/form?pet_id',
                // component: 'pets'
                template: '<pets-form flex layout="column"></pets-form>'
            })
            ;
    })
    .name;

export default petsModule;
