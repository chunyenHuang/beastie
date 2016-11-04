import template from './pets.html';
import './pets.styl';

const petsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class PetsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Pets'];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Pets
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Pets = Pets;
        }
    }
};
export default petsComponent;
