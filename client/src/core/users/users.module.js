import usersComponent from './users.component';
import usersService from './services/users.service';

const usersModule = angular
    .module('beastie.core.users', [])
    .component('users', usersComponent)
    .service('Users', usersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.users', {
                url: '/users',
                // component: 'users'
                template: '<users layout="column" flex></users>'
            });
    })
    .name;

export default usersModule;
