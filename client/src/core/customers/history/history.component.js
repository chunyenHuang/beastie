import template from './history.html';
import './history.styl';

const historyComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class historyController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams',
                'Orders'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams,
            Orders
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
        }
        $onChanges(){
            if(this.customerId){
                this.Orders.query({
                    // customer_id: this.customerId
                }).$promise.then((res)=>{
                    console.log(res);
                    this.history = res;
                });
            }
        }
    }
};
export default historyComponent;
