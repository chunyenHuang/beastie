import template from './selfServiceForm.html';
import './selfServiceForm.styl';

const selfServiceFormComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SelfServiceFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'SelfServices', 'ListItems'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            SelfServices, ListItems
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.SelfServices = SelfServices;
            this.ListItems = ListItems;

            this.pinPasswordsLength = 6;
        }

        $onInit() {
            this.setSelfServices();
            this.data = null;
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
            this.SelfServices.check({
                customer_id: this.$stateParams.customer_id
            }, (res) => {
                this.data = res;
            });
        }

        login(pinPasswords) {
            if (pinPasswords.length != this.pinPasswordsLength) {
                return;
            }
            this.SelfServices.login({
                customer_id: this.$stateParams.customer_id
            }, {
                pinPasswords: pinPasswords
            }, (res) => {
                this.data = res;
                console.log(this.data);
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

    }
};
export default selfServiceFormComponent;
