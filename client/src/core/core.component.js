import './core.styl';
import template from './core.html';

const coreComponent = {
    template,
    controller: /* @ngInject */ class CoreController {
        static get $inject() {
            return ['$timeout', '$state', '$translate', '$mdDialog','Customers', 'METADATA'];
        }
        constructor($timeout, $state, $translate, $mdDialog, Customers, METADATA) {
            this.$timeout = $timeout;
            this.$state = $state;
            this.$translate = $translate;
            this.$mdDialog = $mdDialog;
            this.Customers = Customers;
            this.METADATA = METADATA;
        }

        $onInit() {
            this.message = 'Hello~';
            this.$timeout(() => {
                this.message += 'World';
            }, 1500);
        }

        go(state) {
            this.$state.go(state);
        }

        newOrder() {
            const prompt = this.$mdDialog.prompt()
                .title('Customer Phone number.')
                // .textContent('Bowser is a common name.')
                .placeholder('Phone Number')
                .ariaLabel('Phone Number')
                .ok('Go')
                .cancel('cancel')
                .clickOutsideToClose(false);

            this.$mdDialog.show(prompt).then((phone) => {
                this.Customers.query({
                    phone: phone
                }, (res)=>{
                    this.$state.go('core.orders.form',{
                        customer_id: res[0]._id
                    });
                }, ()=>{
                    // quick create a new customer
                });
            }, () => {});
        }

        toggleLanguage() {
            const key = (this.isChineseNow) ? 'en' : 'zh';
            this.isChineseNow = !this.isChineseNow;
            this.$translate.use(key);
        }
    }
};

export default coreComponent;
