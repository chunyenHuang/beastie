import signatureComponent from './signature.component';
import signatureService from './services/signature.service';

const signatureModule = angular
    .module('beastie.signature', [])
    .component('signature', signatureComponent)
    .service('Signature', signatureService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('client.signature', {
                url: '/signature',
                component: 'signature'
                // template: ''
            });
    })
    .name;

export default signatureModule;
