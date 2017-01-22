import template from './Transactions.html';
import './Transactions.styl';

const transactionsComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class TransactionsController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams',
                'Transactions'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams,
            Transactions
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Transactions = Transactions;
        }
        $onChanges(){
            if(this.customerId){
                this.Transactions.query({
                    customer_id: this.customerId
                }).$promise.then((res)=>{
                    this.transactions = res;
                });
            }
        }
    }
};
export default transactionsComponent;
