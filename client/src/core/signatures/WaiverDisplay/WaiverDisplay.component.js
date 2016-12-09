import template from './WaiverDisplay.html';
import './WaiverDisplay.styl';

const waiverDisplayComponent = {
    template,
    bindings: {
        customerId: '<',
        orderId: '<',
        waiverName: '<'
    },
    controller: /* @ngInject */ class WaiverDisplayController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams',
                'Signatures'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams,
            Signatures
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Signatures = Signatures;
        }
        $onChanges(){
            if(this.customerId && this.orderId){
                this.Signatures.query({
                    customer_id: this.customerId,
                    order_id: this.orderId,
                    name: this.waiverName
                }).$promise.then((res)=>{
                    console.log(res[0]);
                    this.waiver = res[0];
                });
            }
        }
    }
};
export default waiverDisplayComponent;
