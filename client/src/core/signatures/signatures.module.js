import signaturesComponent from './signatures.component';
import signaturesService from './services/signatures.service';
import showSignaturesDialogService from './showSignaturesDialog.service';
import WaiverDisplay from './WaiverDisplay';
const signaturesModule = angular
    .module('beastie.signatures', [])
    .component('signatures', signaturesComponent)
    .component('waiverDisplay', WaiverDisplay)
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
