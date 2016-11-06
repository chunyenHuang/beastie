import settingsComponent from './settings.component';
import settingsService from './services/settings.service';

const settingsModule = angular
    .module('beastie.settings', [])
    .component('settings', settingsComponent)
    .service('Settings', settingsService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.settings', {
                url: '/core.settings',
                template: '<settings layout="column" flex></settings>'
            });
    })
    .name;

export default settingsModule;
