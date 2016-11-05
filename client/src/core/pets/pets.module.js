import petsComponent from './pets.component';
import petsService from './services/pets.service';

const petsModule = angular
    .module('beastie.pets', [])
    .component('pets', petsComponent)
    .service('Pets', petsService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.pets', {
                url: '/pets',
                // component: 'pets'
                template: '<pets flex layout="column"></pets>'

            });
    })
    .name;

export default petsModule;
