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

import Socket from './services/socket.service';
// Shared

// entry modules
import userAuth from './userAuth';
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
        userAuth,
        core,
        client
    ])
    .constant('METADATA', METADATA)
    .service('Socket', Socket)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $urlRouterProvider.otherwise('/userAuth');
    })
    .config(themeConfig)
    .config(resourceConfig)
    .config(languageConfig)
    .config(iconConfig)

.filter('orderObjectBy', () => {
    return (items, field, reverse) => {
        const filtered = [];
        angular.forEach(items, (item) => {
            filtered.push(item);
        });
        filtered.sort((a, b) => {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});
