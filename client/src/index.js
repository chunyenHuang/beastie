// cores
import angular from 'client/node_modules/angular';
import uiRouter from 'client/node_modules/angular-ui-router';
import ngAria from 'client/node_modules/angular-aria';
import ngMaterial from 'client/node_modules/angular-material';
import 'client/node_modules/angular-material/angular-material.css';
import 'client/node_modules/angular-local-storage';
import 'client/node_modules/angular-smart-table';
import ngMdIcons from 'client/node_modules/angular-material-icons';
import ngAnimate from 'client/node_modules/angular-animate';

// configs
import themeConfig from './themeConfig';
import METADATA from './METADATA';

// entry modules
import app from './app';

angular
    .module('app', [
        uiRouter,
        ngAnimate,
        ngAria,
        ngMaterial,
        ngMdIcons,
        'LocalStorageModule',
        'smart-table',
        app
    ])
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $urlRouterProvider.otherwise('/');
    })
    .config(themeConfig)
    .constant('METADATA', METADATA);
