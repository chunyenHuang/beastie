import template from './pets.html';
import './pets.styl';

const petsComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class PetsController {
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

        $onInit() {
            this.$state.go('core.pets.form');
        }
    }
};
export default petsComponent;
