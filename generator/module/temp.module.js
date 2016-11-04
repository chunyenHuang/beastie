import <%= name %>Component from './<%= name %>.component';
import <%= name %>Service from './services/<%= name %>.service';

const <%= name %>Module = angular
    .module('beastie.<%= name %>', [])
    .component('<%= name %>', <%= name %>Component)
    .service('<%= upCaseName %>', <%= name %>Service)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('<%= name %>', {
                url: '/<%= name %>',
                component: '<%= name %>'
                // template: ''

            });
    })
    .name;

export default <%= name %>Module;
