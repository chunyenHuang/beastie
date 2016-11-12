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
                url: '/signature?waiverName',
                component: 'signature'
                    // template: ''
            });
    })
    .config(($touchProvider) => {
        $touchProvider.ngClickOverrideEnabled(true);
    })
    .directive('ngTouchstart', [() => {
        return (scope, element, attr) => {
            element.on('touchstart', () => {
                scope.$apply(() => {
                    scope.$eval(attr.ngTouchstart);
                });
            });
        };
    }])
    .directive('ngTouchend', [() => {
        return (scope, element, attr) => {
            element.on('touchend', () => {
                scope.$apply(() => {
                    scope.$eval(attr.ngTouchend);
                });
            });
        };
    }])
    .name;

export default signatureModule;
