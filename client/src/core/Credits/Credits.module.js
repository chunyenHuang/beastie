import creditsComponent from './Credits.component';
import creditsService from './services/Credits.service';
import addCreditsDialogService from './AddCredits';
const creditsModule = angular
    .module('beastie.credits', [])
    .component('credits', creditsComponent)
    .service('Credits', creditsService)
    .service('AddCreditsDialog', addCreditsDialogService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('credits', {
                url: '/credits',
                template: `
                <credits layout="column" flex></credits>
                `
            });
    })
    .name;

export default creditsModule;
