import template from './<%= upCaseName %>.html';
import './<%= upCaseName %>.styl';

const <%= name %>Component = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class <%= upCaseName %>Controller {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;

        }
    }
};
export default <%= name %>Component;
