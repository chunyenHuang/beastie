import template from './petsList.html';
import './petsList.styl';

const petsListComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class PetsListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Pets'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Pets
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Pets = Pets;
        }
        $onInit() {
            this.Pets.query({}, (results) => {
                this.pets = results;
            });
        }
    }
};
export default petsListComponent;
