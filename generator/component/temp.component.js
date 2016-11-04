import template from './<%= name %>.html';
import './<%= name %>.styl';

const <%= name %>Component = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class <%= upCaseName %>Controller {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
        }
    }
};
export default <%= name %>Component;
