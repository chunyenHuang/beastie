import signaturesComponent from './signatures.component';
import signaturesService from './services/signatures.service';
import showSignaturesDialogService from './showSignaturesDialog.service';
const signaturesModule = angular
    .module('beastie.signatures', [])
    .component('signatures', signaturesComponent)
    .service('Signatures', signaturesService)
    .service('ShowSignaturesDialog', showSignaturesDialogService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.signatures', {
                url: '/signatures',
                component: 'signatures'
                // template: ''

            });
    })
    .name;

export default signaturesModule;
