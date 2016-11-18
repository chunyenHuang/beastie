import template from './dashboard.html';
import './dashboard.styl';

const dashboardComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class DashboardController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Customers'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Customers
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
        }
        $onInit() {
            if (!this.$stateParams.customer_id) {
                this.$state.go('client.customersCheckIn');
            } else {
                this.Customers.getWithPets({
                    id: this.$stateParams.customer_id
                }, (res) => {
                    console.log(res);
                    this.customer = res;
                });
            }
        }

        updateMyInfo() {
            this.$state.go('client.customersForm', {
                customer_id: this.$stateParams.customer_id
            });
        }

        updateMyPet(petId) {
            console.log(petId);
            this.$state.go('client.petsForm', {
                pet_id: petId,
                customer_id: this.$stateParams.customer_id
            });
        }

        addPet() {
            this.$state.go('client.petsForm', {
                customer_id: this.$stateParams.customer_id
            });
        }
    }
};
export default dashboardComponent;
