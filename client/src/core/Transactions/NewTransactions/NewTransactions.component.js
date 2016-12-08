import template from './NewTransactions.html';
import './NewTransactions.styl';

const newTransactionsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class NewTransactionsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                '$mdDialog',
                'Credits', 'SelfServices', 'TransactionsDialog',
                'Socket'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, $mdDialog,
            Credits, SelfServices, TransactionsDialog, Socket
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$mdDialog = $mdDialog;
            this.Credits = Credits;
            this.SelfServices = SelfServices;
            this.TransactionsDialog = TransactionsDialog;

            Socket.on('creditsPurchased', (res) => {
                this.reload();
            });

            Socket.on('selfServicesPurchase', (res) => {
                this.reload();
            });

        }
        $onInit() {
            this.reload();
        }

        reload() {
            this.setUnsolvedCreditsBalance();
            this.setUnsolvedSelfServices();
        }

        setUnsolvedCreditsBalance() {
            this.Credits.query({}).$promise.then((res) => {
                console.log(res);
                this.credits = [];
                angular.forEach(res, (credit) => {
                    if (parseFloat(credit.balance) > 0) {
                        this.credits.push(credit);
                    }
                });
                console.log(this.credits);
            }, (err) => {
                console.log(err);
            });
        }

        setUnsolvedSelfServices() {
            this.SelfServices.query({}).$promise.then((res) => {
                this.selfServices = [];
                angular.forEach(res, (selfService) => {
                    if (!selfService.isPaid) {
                        this.selfServices.push(selfService);
                    }
                });
                console.log(this.selfServices);
            }, (err) => {
                console.log(err);
            });
        }

        pay(item, type) {
            let query = {};
            switch (type) {
                case 'credit':
                    query = {
                        customer_id: item.customer_id,
                        credit_id: item._id
                    };
                    break;
                case 'selfService':
                    query = {
                        customer_id: item.customer_id,
                        selfService_id: item._id
                    };
                    break;

                default:
            }
            this.TransactionsDialog(query).then((res) => {
                console.log(res);
                this.reload();
            }, (err) => {
                console.log(err);
            });
        }

        cancelSelfService(item){
            const confirm = this.$mdDialog.confirm()
                .title('Do you want to cancel this self service?')
                // .textContent(textContent)
                .ariaLabel('cancel self service')
                .ok('YES')
                .cancel('NO');
            this.$mdDialog.show(confirm).then(() => {
                this.SelfServices.delete({
                    id: item._id
                }).$promise.then((res)=>{
                    console.log(res);
                    this.selfServices.splice(this.selfServices.indexOf(item), 1);
                },(err)=>{
                    console.log(err);
                });
            }, () => {});
        }
    }
};
export default newTransactionsComponent;
