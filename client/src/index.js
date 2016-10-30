// cores
import angular from 'client/node_modules/angular';
import uiRouter from 'client/node_modules/angular-ui-router';
import ngAria from 'client/node_modules/angular-aria';
import ngMaterial from 'client/node_modules/angular-material';
import 'client/node_modules/angular-material/angular-material.css';
import ngAnimate from 'client/node_modules/angular-animate';
import 'client/node_modules/angular-translate';
import 'client/node_modules/angular-translate-loader-partial';
import ngResource from 'client/node_modules/angular-resource';
import ngSanitize from 'client/node_modules/angular-sanitize';

// configs
import themeConfig from './themeConfig';
import resourceConfig from './resourceConfig';
import languageConfig from './languageConfig';
import iconConfig from './iconConfig';
import METADATA from './METADATA';

// entry modules
import core from './core';
import client from './client';

angular
    .module('beastie', [
        uiRouter,
        ngResource,
        ngSanitize,
        ngAnimate,
        ngAria,
        ngMaterial,
        'pascalprecht.translate',
        core,
        client
    ])
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $urlRouterProvider.otherwise('/');
    })
    .config(themeConfig)
    // .config(resourceConfig)
    .config(languageConfig)
    .config(iconConfig)
    .constant('METADATA', METADATA);
