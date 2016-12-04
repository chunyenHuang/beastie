import template from './Transactions.html';
import './Transactions.styl';

const transactionsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class TransactionsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Transactions'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Transactions
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Transactions = Transactions;
        }
    }
};
export default transactionsComponent;
