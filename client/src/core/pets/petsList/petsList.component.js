import template from './petsList.html';
import './petsList.styl';

const petsListComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class PetsListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Pets', 'Customers'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Pets, Customers
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Pets = Pets;
            this.Customers = Customers;
        }
        $onInit() {
            this.Pets.query({}, (results) => {
                this.pets = results;
                console.log(this.pets);
            });
        }
    }
};
export default petsListComponent;
