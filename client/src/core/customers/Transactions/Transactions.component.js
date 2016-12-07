import template from './Transactions.html';
import './Transactions.styl';

const transactionsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class TransactionsController {
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
    }
};
export default transactionsComponent;
