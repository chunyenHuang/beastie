import appComponent from './app.component';

const appModule = angular
    .module('app.core', [])
    .component('app', appComponent)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('app', {
                url: '/',
                component: 'app'
            });
    })
    .name;

export default appModule;
