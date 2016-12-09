import petsComponent from './pets.component';
import petsListComponent from './petsList';

import petsService from './services/pets.service';
import petPhotoGallery from './PetPhotoGallery';

const petsModule = angular
    .module('beastie.pets', [])
    .component('pets', petsComponent)
    .component('petsList', petsListComponent)
    .component('petPhotoGallery', petPhotoGallery)
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
            ;
    })
    .name;

export default petsModule;
