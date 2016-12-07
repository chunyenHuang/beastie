import <%= name %>Component from './<%= upCaseName %>.component';
import <%= name %>ServiceModule from './services';

const <%= name %>Module = angular
    .module('eplan.core.<%= name %>', [
        <%= name %>ServiceModule
    ])
    .component('<%= name %>', <%= name %>Component)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('<%= name %>', {
                url: '/<%= name %>',
                template:`
                    <<%= name %> layout="column" flex></<%= name %>>
                `
                // component: '<%= name %>'
            });
    })
    .name;

export default <%= name %>Module;
