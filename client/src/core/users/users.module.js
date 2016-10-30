import usersComponent from './users.component';
import usersService from './services/users.service';

const usersModule = angular
    .module('beastie.core.users', [])
    .component('users', usersComponent)
    .service('Users', usersService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('users', {
                url: '/users',
                component: 'users'
            });
    })
    .name;

export default usersModule;
