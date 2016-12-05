import template from './List.html';
import './List.styl';

const listComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListController {
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
        $onInit() {
            this.Transactions.query({}).$promise.then((res) => {
                console.log(res);
                this.transactions = res;
            });
        }
        update(transaction) {
            console.log(transaction);
            this.Transactions.update({
                id: transaction._id
            }, transaction, (res) => {
                console.log(res);
            });
        }
    }
};
export default listComponent;
