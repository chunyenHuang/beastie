import coreComponent from './core.component';
import users from './users';


const coreModule = angular
    .module('beastie.core', [
        users,
    ])
    .component('core', coreComponent)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core', {
                url: '/',
                component: 'core'
            });
    })
    .config(($translatePartialLoaderProvider) => {
        'ngInject';
        $translatePartialLoaderProvider.addPart('core');
    })
    .name;

export default coreModule;
