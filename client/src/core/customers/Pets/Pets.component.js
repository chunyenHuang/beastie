import template from './Pets.html';
import './Pets.styl';

const petsComponent = {
    template,
    bindings: {
        pets: '<'
    },
    controller: /* @ngInject */ class PetsController {
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
        $onChanges() {
            if (this.pets) {
                this.selectedPet = this.pets[0];
            }
        }

        changePet(pet) {
            this.$timeout(()=>{
                this.selectedPet = null;
            });
            this.$timeout(()=>{
                this.selectedPet = pet;
            },5);
        }
    }
};
export default petsComponent;
