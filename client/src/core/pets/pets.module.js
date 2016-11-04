import petsComponent from './pets.component';
import petsService from './services/pets.service';

const petsModule = angular
    .module('beastie.pets', [])
    .component('pets', petsComponent)
    .service('Pets', petsService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('pets', {
                url: '/pets',
                component: 'pets'
                // template: ''

            });
    })
    .name;

export default petsModule;
