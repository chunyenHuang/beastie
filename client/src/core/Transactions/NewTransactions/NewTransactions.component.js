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
                'ListItems',
                'Credits', 'SelfServices', 'TransactionsDialog',
                'Socket'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, $mdDialog,
            ListItems,
            Credits, SelfServices, TransactionsDialog, Socket
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$mdDialog = $mdDialog;
            this.ListItems = ListItems;
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
            this.setSelfServices();
        }

        reload() {
            this.setUnsolvedCreditsBalance();
            this.setUnsolvedSelfServices();
        }

        setSelfServices() {
            this.ListItems.query({
                type: 'selfServices'
            }, (listItems) => {
                this.selfServiceList = {};
                angular.forEach(listItems[0].items, (item) => {
                    this.selfServiceList[item.type] = item.subItems;
                });
                console.log(this.selfServiceList);
            });
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

        cancelSelfService(item) {
            const confirm = this.$mdDialog.confirm()
                .title('Do you want to cancel this self service?')
                // .textContent(textContent)
                .ariaLabel('cancel self service')
                .ok('YES')
                .cancel('NO');
            this.$mdDialog.show(confirm).then(() => {
                this.SelfServices.delete({
                    id: item._id
                }).$promise.then((res) => {
                    console.log(res);
                    this.selfServices.splice(this.selfServices.indexOf(item), 1);
                }, (err) => {
                    console.log(err);
                });
            }, () => {});
        }

        isAddonSelected(addon, item) {
            if (!addon || !item) {
                return false;
            }
            for (var i = 0; i < item.addons.length; i++) {
                if (item.addons[i].keyID == addon.keyID) {
                    return item.addons[i];
                }
            }
            return false;
        }

        editSelfService(item) {
            let newTotal = 0;
            for (var i = 0; i < item.addons.length; i++) {
                newTotal += item.addons[i].price;
            }
            for (var i = 0; i < item.services.length; i++) {
                newTotal += item.services[i].price;
            }
            item.total = newTotal;
            console.log(item);
            this.SelfServices.update({
                id: item._id
            }, item).$promise.then((res) => {
                console.log(res);
            });
        }

        toggleAddons(addon, item) {
            const matchAddon = this.isAddonSelected(addon, item);
            if (matchAddon) {
                item.addons.splice(matchAddon, 1);
            } else {
                item.addons.push(addon);
            }
            console.log(item);
            this.editSelfService(item);
        }
    }
};
export default newTransactionsComponent;
