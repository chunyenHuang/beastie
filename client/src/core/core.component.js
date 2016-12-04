import './core.styl';
import template from './core.html';
import quickStartDialog from './quickStart.dialog';
import newCustomerQuickDialog from './newCustomerQuick.dialog';
import oldCustomerPanelDialog from './oldCustomerPanel.dialog';

const coreComponent = {
    template,
    controller: /* @ngInject */ class CoreController {
        static get $inject() {
            return [
                '$timeout', '$state', '$translate', '$mdDialog', '$document',
                'Customers', 'METADATA', 'InhouseOrdersDialog', 'Fullscreen',
                'CustomerDetailDialog',
                'Socket'
            ];
        }
        constructor(
            $timeout, $state, $translate, $mdDialog, $document,
            Customers, METADATA, InhouseOrdersDialog, Fullscreen,
            CustomerDetailDialog, Socket
        ) {
            this.$timeout = $timeout;
            this.$state = $state;
            this.$translate = $translate;
            this.$mdDialog = $mdDialog;
            this.$document = $document;
            this.Customers = Customers;
            this.METADATA = METADATA;
            this.InhouseOrdersDialog = InhouseOrdersDialog;
            this.CustomerDetailDialog = CustomerDetailDialog;
            this.Fullscreen = Fullscreen;
            this.fullscreenIcon = 'fullscreen';

            Socket.on('customerCheckIn', (res) => {
                this.$timeout(() => {
                    this.hasNewCheckedIn = true;
                });
            });

            Socket.on('creditsPurchased', (res) => {
                // add the new ticket
                console.log(res);
                this.$timeout(() => {
                    this.hasNewPurchase = true;
                });
            });

            Socket.on('selfServicesPurchase', (res) => {
                console.log(res);
                this.$timeout(() => {
                    this.hasNewPurchase = true;
                });
            });
            // this.hasNewPurchase = true;
            // this.hasNewCheckedIn = true;

        }

        $onInit() {
            // this.newCustomer(123456789);
            // this.openInhouseOrdersDialog();
            // this.testStartup();
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

        testStartup() {
            this.Customers.query({
                phone: 8888888888
            }, (res) => {
                this.oldCustomer(res[0]._id);
            }, () => {
                // quick create a new customer
                this.newCustomer(phone);
            });
        }

        startup() {
            this.$mdDialog.show(
                quickStartDialog({}, this.$document[0].getElementById('core'))
            ).then((phone) => {
                this.Customers.query({
                    phone: phone
                }, (res) => {
                    this.oldCustomer(res[0]._id);
                }, () => {
                    // quick create a new customer
                    this.newCustomer(phone);
                });
            }, () => {});
        }

        oldCustomer(customer_id) {
            this.$mdDialog.show(
                oldCustomerPanelDialog({
                    customer_id: customer_id
                }, this.$document[0].getElementById('core'))
            ).then((select) => {
                switch (select.type) {
                    case 'info':
                        this.CustomerDetailDialog({
                            customer_id: select.customer._id,
                            tab: 'customer'
                        });
                        break;
                    case 'checkIn':
                        this.Customers.checkIn({
                            phone: select.customer.phone
                        }, (res) => {
                            console.log(res);
                        }, () => {});
                        break;
                    case 'editOrder':
                        this.$state.go('core.orders.form', {
                            order_id: select._id // ??
                        });
                        break;
                    case 'newOrder':
                        this.$state.go('core.orders.form', {
                            customer_id: select.customer._id
                        });
                        break;
                    default:

                }
            });
        }

        newCustomer(phone) {
            this.$mdDialog.show(
                newCustomerQuickDialog({
                    phone: phone
                }, this.$document[0].getElementById('core'))
            ).then((customer) => {
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
