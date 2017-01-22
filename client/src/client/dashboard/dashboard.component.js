import template from './dashboard.html';
import './dashboard.styl';

const dashboardComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class DashboardController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Customers', 'Orders', 'Pets'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Customers, Orders, Pets
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Customers = Customers;
            this.Orders = Orders;
            this.Pets = Pets;
            this.preview = {};
        }
        $onInit() {
            if (!this.$stateParams.customer_id) {
                this.$state.go('client.customersCheckIn');
            } else {
                this.Customers.getWithPets({
                    id: this.$stateParams.customer_id
                }, (res) => {
                    this.customer = res;
                    angular.forEach(this.customer.pets, (pet) => {
                        this.preview[pet._id] = 'images/pets/' + pet._id + '.png';
                    });
                    this.getMyOrders();
                });
            }
        }

        selfService() {
            this.$state.go('client.selfServiceForm', {
                customer_id: this.$stateParams.customer_id,
                currentFormState: 'name'
            });
        }

        getMyOrders() {
            this.pictures = {};
            this.orders = [];
            this.Orders.query({
                customer_id: this.$stateParams.customer_id
            }, (res) => {
                this.orders = res;
                angular.forEach(this.orders, (order) => {
                    this.Pets.getPicturesPath({
                        id: order.pet_id
                    }, (res) => {
                        this.pictures[order._id] = res;
                    });
                });
            });
        }

        updateMyInfo() {
            this.$state.go('client.customersForm', {
                customer_id: this.$stateParams.customer_id
            });
        }

        updateMyPet(petId) {
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
