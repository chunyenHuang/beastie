import userAuthComponent from './userAuth.component';
import userAuthLogoutComponent from './userAuthLogout';

import userAuthService from './services/userAuth.service';

const userAuthModule = angular
    .module('beastie.userAuth', [])
    .component('userAuth', userAuthComponent)
    .component('userAuthLogout', userAuthLogoutComponent)
    .service('UserAuth', userAuthService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('userAuth', {
                url: '/userAuth',
                template: '<user-auth layout="column" flex></user-auth'
            });
    })
    .name;

export default userAuthModule;
