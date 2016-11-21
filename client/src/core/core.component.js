import './core.styl';
import template from './core.html';
import quickStartDialog from './quickStart.dialog';
import newCustomerQuickDialog from './newCustomerQuick.dialog';

const coreComponent = {
    template,
    controller: /* @ngInject */ class CoreController {
        static get $inject() {
            return [
                '$timeout', '$state', '$translate', '$mdDialog', '$document',
                'Customers', 'METADATA', 'InhouseOrdersDialog', 'Fullscreen'
            ];
        }
        constructor(
            $timeout, $state, $translate, $mdDialog, $document,
            Customers, METADATA, InhouseOrdersDialog, Fullscreen
        ) {
            this.$timeout = $timeout;
            this.$state = $state;
            this.$translate = $translate;
            this.$mdDialog = $mdDialog;
            this.$document = $document;
            this.Customers = Customers;
            this.METADATA = METADATA;
            this.InhouseOrdersDialog = InhouseOrdersDialog;
            this.Fullscreen = Fullscreen;
            this.fullscreenIcon = 'fullscreen';
        }

        $onInit() {
            // this.newCustomer(123456789);
            // this.openInhouseOrdersDialog();
        }

        toggleFullscreen() {
            if (this.Fullscreen.isEnabled()) {
                this.fullscreenIcon = 'fullscreen';
                this.Fullscreen.cancel();
            } else {
                this.Fullscreen.all();
                this.fullscreenIcon = 'fullscreen-exit';
                this.showFullScreenButton = false;
            }
        }

        go(state) {
            this.$state.go(state);
        }

        openInhouseOrdersDialog() {
            this.InhouseOrdersDialog().then((res) => {

            }, (err) => {

            });
        }

        newOrder() {
            this.$mdDialog.show(
                quickStartDialog({}, this.$document[0].getElementById('core'))
            ).then((phone) => {
                this.Customers.query({
                    phone: phone
                }, (res) => {
                    this.$state.go('core.orders.form', {
                        customer_id: res[0]._id
                    });
                }, () => {
                    // quick create a new customer
                    this.newCustomer(phone);
                });
            }, () => {});

            // const prompt = this.$mdDialog.prompt()
            //     .title('Customer Phone number.')
            //     // .textContent('Bowser is a common name.')
            //     .placeholder('Phone Number')
            //     .ariaLabel('Phone Number')
            //     .ok('Go')
            //     .cancel('cancel')
            //     .clickOutsideToClose(false);
            //
            // this.$mdDialog.show(prompt).then((phone) => {
            //     this.Customers.query({
            //         phone: phone
            //     }, (res) => {
            //         this.$state.go('core.orders.form', {
            //             customer_id: res[0]._id
            //         });
            //     }, () => {
            //         // quick create a new customer
            //         this.newCustomer(phone);
            //     });
            // }, () => {});
        }

        newCustomer(phone) {
            this.$mdDialog.show(
                newCustomerQuickDialog({
                    phone: phone
                }, this.$document[0].getElementById('core'))
            ).then((customer) => {
                console.log(customer);
                this.$state.go('core.orders.form', {
                    customer_id: customer._id,
                    order_id: null
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
