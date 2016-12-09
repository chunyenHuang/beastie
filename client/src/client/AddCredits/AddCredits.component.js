import template from './AddCredits.html';
import './AddCredits.styl';

const addCreditsComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class AddCreditsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Credits', 'ListItems',
                '$mdDialog'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Credits, ListItems, $mdDialog
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$mdDialog = $mdDialog;
            this.Credits = Credits;
            this.ListItems = ListItems;
        }

        $onInit() {
            this.setCreditsPackages();
            this.Credits.get({
                customer_id: this.$stateParams.customer_id
            }, (res) => {
                this.data = res;
            });
        }

        $onDestroy() {
            this.data = null;
        }

        backToSelfService() {
            this.$state.go('client.selfServiceForm', {
                customer_id: this.$stateParams.customer_id
            });
        }

        setCreditsPackages() {
            this.ListItems.query({
                type: 'creditsPackages'
            }, (listItems) => {
                this.list = listItems[0].items;
                console.log(this.list);
            });
        }

        purchase() {
            this.Credits.purchase({
                customer_id: this.$stateParams.customer_id
            }, {
                customer_id: this.$stateParams.customer_id,
                package: this.selected
            }).$promise.then((res) => {
                console.log(res);
                this._alert(()=>{
                    this.backToSelfService();
                });
            }, (err) => {
                console.log(err);
            });
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

    }
};
export default addCreditsComponent;
