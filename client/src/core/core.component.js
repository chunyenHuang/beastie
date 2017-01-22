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

            Socket.on('customerCheckIn', () => {
                this.$timeout(() => {
                    this.hasNewCheckedIn = true;
                });
            });

            Socket.on('creditsPurchased', () => {
                this.$timeout(() => {
                    this.hasNewPurchase = true;
                });
            });

            Socket.on('selfServicesPurchase', () => {
                this.$timeout(() => {
                    this.hasNewPurchase = true;
                });
            });

            Socket.on('reLogin', () => {
                console.log('login please');
                this.$state.go('userAuth');
            });
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
            this.InhouseOrdersDialog();
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
                    case 'credits':
                        this.CustomerDetailDialog({
                            customer_id: select.customer._id,
                            tab: 'credits'
                        });
                        break;
                    case 'checkIn':
                        this.Customers.checkIn({
                            phone: select.customer.phone
                        }, (res) => {
                            console.log(res);
                            this.$state.go('core.orders.list', {
                                '#': res.order_id,
                                'type': 'checkInAt'
                            }, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }, (err) => {
                            console.log(err);
                        });
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
