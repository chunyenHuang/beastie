import <%= name %>Service from './<%= upCaseName %>.service';

const <%= name %>Module = angular
    .module('eplan.core.<%= name %>.services', [])
    .service('<%= upCaseName %>Service', <%= name %>Service)
    .name;

export default <%= name %>Module;
