import template from './selfServices.html';
import './selfServices.styl';

const selfServicesComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SelfServicesController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'SelfServices'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            SelfServices
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.SelfServices = SelfServices;
        }
    }
};
export default selfServicesComponent;
