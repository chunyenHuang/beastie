import template from './selfServiceForm.html';
import './selfServiceForm.styl';

const selfServiceFormComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SelfServiceFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', '$mdDialog',
                'Credits',
                'AddCreditsDialog',
                'SelfServices', 'ListItems',
                'Transactions'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, $mdDialog,
            Credits, AddCreditsDialog,
            SelfServices, ListItems, Transactions
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$mdDialog = $mdDialog;
            this.Credits = Credits;
            this.AddCreditsDialog = AddCreditsDialog;
            this.SelfServices = SelfServices;
            this.ListItems = ListItems;
            this.Transactions = Transactions;

            this.pinPasswordsLength = 6;

            this.selected = {
                services: [],
                addons: []
            };
        }

        $onInit() {
            this.setSelfServices();
        }

        $onDestroy() {
            this.data = null;
        }

        backToDashboard() {
            this.$state.go('client.dashboard', {
                customer_id: this.$stateParams.customer_id
            });
        }

        reload() {
            this.Credits.get({
                customer_id: this.$stateParams.customer_id
            }, (res) => {
                this.data = res;
            });
        }

        login(pinPasswords) {
            if (pinPasswords.length != this.pinPasswordsLength) {
                return;
            }
            this.Credits.login({
                customer_id: this.$stateParams.customer_id
            }, {
                customer_id: this.$stateParams.customer_id,
                pinPasswords: pinPasswords
            }, (res) => {
                this.data = res;
            });
        }

        setSelfServices() {
            this.ListItems.query({
                type: 'selfServices'
            }, (listItems) => {
                this.list = {};
                angular.forEach(listItems[0].items, (item) => {
                    this.list[item.type] = item.subItems;
                });
            });
        }

        addCredits() {
            this.$state.go('client.addCredits', {
                customer_id: this.$stateParams.customer_id
            });
        }

        isIn(type, item) {
            const pos = this.selected[type].indexOf(item);
            return (pos > -1) ? true : false;
        }

        removeFrom(type, item) {
            const pos = this.selected[type].indexOf(item);
            this.selected[type].splice(pos, 1);
        }

        getTotal() {
            let total = 0;
            for (let prop in this.selected) {
                for (var i = 0; i < this.selected[prop].length; i++) {
                    total += parseFloat(this.selected[prop][i].price);
                }
            }
            return total;
        }

        select(item, type) {
            switch (type) {
                case 'services':
                    if (this.isIn(type, item)) {
                        this.removeFrom(type, item);
                    } else {
                        this.selected[type] = [item];
                    }
                    break;
                case 'addons':
                    if (this.isIn(type, item)) {
                        this.removeFrom(type, item);
                    } else {
                        this.selected[type].push(item);
                    }
                    break;
                default:

            }
        }

        _alert(callback) {
            this.$timeout(()=>{
                this.$mdDialog.hide();
            }, 2000);
            this.$mdDialog.show(
                this.$mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Self Service order completes. ')
                .textContent('Please see the counter for further information.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                // .targetEvent(ev)
            ).then(()=>{
                if(callback){
                    return callback();
                }
            }, ()=>{
                if(callback){
                    return callback();
                }
            });
        }

        purchase(isPaidByStoreCredit) {
            this.SelfServices.purchase(Object.assign(
                this.selected, {
                    customer_id: this.$stateParams.customer_id,
                    total: this.getTotal()
                }
            )).$promise.then((res) => {
                if (isPaidByStoreCredit) {
                    this.checkoutWithCredits(res);
                } else {
                    this._alert(()=>{
                        this.backToDashboard();
                    });
                }
            });
        }

        checkoutWithCredits(selfService) {
            this.Transactions.checkout({
                selfService_id: selfService._id,
                customer_id: this.$stateParams.customer_id,
                isPaidByStoreCredit: true,
                total: selfService.total,
                isTaxIncluded: false,
                paymentTransactionsNumber: null,
                note: null,
                isVoidedAt: null
            }).$promise.then(() => {
                this._alert(()=>{
                    this.backToDashboard();
                });
            });
        }
    }
};
export default selfServiceFormComponent;
