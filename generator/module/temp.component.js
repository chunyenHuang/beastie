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
                '$state',
                '$stateParams'
            ];
        }
        constructor(
            $log,
            $state,
            $stateParams
        ) {
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
        }
    }
};
export default <%= name %>Component;
