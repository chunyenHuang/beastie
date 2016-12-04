import template from './selfServiceForm.html';
import './selfServiceForm.styl';

const selfServiceFormComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SelfServiceFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Credits',
                'AddCreditsDialog',
                'SelfServices', 'ListItems'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Credits, AddCreditsDialog,
            SelfServices, ListItems
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Credits = Credits;
            this.AddCreditsDialog = AddCreditsDialog;
            this.SelfServices = SelfServices;
            this.ListItems = ListItems;

            this.pinPasswordsLength = 6;

            this.selected = {
                services: [],
                addons: []
            };
        }

        $onInit() {
            this.setSelfServices();
            // this.data = null;
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
                console.log(this.data);
            }, (err) => {
                console.log(err);
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
                console.log(this.list);
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

        purchase() {
            this.SelfServices.purchase(Object.assign(
                this.selected, {
                    customer_id: this.$stateParams.customer_id,
                    total: this.getTotal()
                }
            )).$promise.then((res) => {
                console.log(res);
                this.backToDashboard();
            }, (err) => {
                console.log(err);
            });
        }

        purchaseWithCredits() {
            this.Credits.use({
                customer_id: this.$stateParams.customer_id
            }, {
                customer_id: this.$stateParams.customer_id,
                service: this.selected,
                useCredit: this.getTotal()
            }).$promise.then((res) => {
                console.log(res);
                this.backToDashboard();
            }, (err) => {
                console.log(err);
            });
        }

    }
};
export default selfServiceFormComponent;
