import selfServicesComponent from './selfServices.component';
import selfServicesService from './services/selfServices.service';

const selfServicesModule = angular
    .module('beastie.core.selfServices', [])
    .component('selfServices', selfServicesComponent)
    .service('SelfServices', selfServicesService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('selfServices', {
                url: '/selfServices',
                template: `
                    <self-services layout="column" flex></self-services>
                `
            });
    })
    .name;

export default selfServicesModule;
