import template from './<%= name %>.html';
import './<%= name %>.styl';

const <%= name %>Component = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class <%= upCaseName %>Controller {
        static get $inject() {
            return ['$log', '$timeout', '$scope'];
        }
        constructor($log, $timeout, $scope) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
        }
    }
};
export default <%= name %>Component;
