import template from './Waivers.html';
import './Waivers.styl';

const waiversComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class WaiversController {
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
        $onChanges() {
            if (this.customerId) {
                this.Signatures.query({
                    customer_id: this.customerId
                }).$promise.then((waivers) => {
                    this.waivers = waivers;
                });
            }
        }
    }
};
export default waiversComponent;
