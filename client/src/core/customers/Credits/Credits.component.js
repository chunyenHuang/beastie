import template from './Credits.html';
import './Credits.styl';

const creditsComponent = {
    template,
    bindings: {
        customerId: '<'
    },
    controller: /* @ngInject */ class CreditsController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams',
                'Credits',
                'TransactionsDialog',
                'ListItems',
                'CustomerDetailDialog'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams,
            Credits,
            TransactionsDialog,
            ListItems,
            CustomerDetailDialog
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Credits = Credits;
            this.TransactionsDialog = TransactionsDialog;
            this.ListItems = ListItems;
            this.CustomerDetailDialog = CustomerDetailDialog;

            this.selectedDueTotal = 0;
        }
        $onInit() {
            this.setCreditsPackages();
        }
        $onChanges() {
            if (this.customerId) {
                this.Credits.get({
                    customer_id: this.customerId
                }, (res) => {
                    console.log(res);
                    this.credits = res;
                });
            }
        }

        setCreditsPackages() {
            this.ListItems.query({
                type: 'creditsPackages'
            }, (listItems) => {
                this.list = listItems[0].items;
                console.log(this.list);
            });
        }

        /*
            package: {
                name:
                total:
                credit:
            }
        */

        purchase() {
            let creditPackage = this.selected;
            if (this.selected == 'custom') {
                creditPackage = {
                    name: 'custom credit amount',
                    total: this.selectedDueTotal,
                    credit: this.selectedDueTotal
                };
            }
            this.Credits.purchase({
                customer_id: this.customerId
            }, {
                customer_id: this.customerId,
                package: creditPackage
            }).$promise.then((res) => {
                console.log(res);
                this.credits = res;
                this.pay();
            }, (err) => {
                console.log(err);
            });
        }

        pay() {
            this.TransactionsDialog({
                customer_id: this.customerId,
                credit_id: this.credits._id
            }).then(() => {
                this.CustomerDetailDialog({
                    customer_id: this.customerId,
                    tab: 'credits'
                }, () => {});
            }, () => {
                this.CustomerDetailDialog({
                    customer_id: this.customerId,
                    tab: 'credits'
                }, () => {});
            });
        }

        selectCredit() {
            if (!this.selected) {
                return;
            }
            if (this.selected == 'custom') {
                this.selectedDueTotal = 0;
            } else {
                this.selectedDueTotal = this.selected.total;
            }
        }

        cancelUnpaid() {
            if (this.credits.balance === 0) {
                return;
            }
            let unpaidBalance = this.credits.balance;
            let eqCredits = 0;
            let item;
            const splices = [];
            for (var i = this.credits.purchased.length - 1; i >= 0; i--) {
                item = this.credits.purchased[i];
                if (unpaidBalance >= item.package.total) {
                    splices.push(item);
                    unpaidBalance -= item.package.total;
                    eqCredits += item.package.credit;
                }
            }
            this.credits.balance = 0;
            this.credits.credit -= eqCredits;
            let pos;
            for (var x = 0; x < splices.length; x++) {
                pos = this.credits.purchased.indexOf(splices[x]);
                this.credits.purchased.splice(pos, 1);
            }
            this.Credits.update({
                customer_id: this.customerId
            }, this.credits).$promise.then((res) => {
                console.log(res);
            });
        }

    }
};
export default creditsComponent;
