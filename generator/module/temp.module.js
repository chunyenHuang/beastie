import uiRouter from 'angular-ui-router';
import <%= name %>Component from './<%= name %>.component';
import <%= name %>Service from './services/<%= name %>.service';

const <%= name %>Module = angular
    .module('app.core.<%= name %>', [
        uiRouter
    ])
    .component('<%= name %>', <%= name %>Component)
    .service('<%= name %>Service', <%= name %>Service)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('<%= name %>', {
                url: '/<%= name %>',
                component: '<%= name %>'
            });
    })
    .name;

export default <%= name %>Module;
