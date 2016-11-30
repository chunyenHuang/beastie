import template from './oldCustomerPanel.dialog.html';

export default (locals, parent) => ({
    locals,
    parent,
    template: template,
    controller: /* @ngInject */ class OpenDocumentController {
        static get $inject() {
            return [
                '$timeout', '$document', '$mdDialog', 'Customers', 'SharedUtil'
            ];
        }
        constructor(
            $timeout, $document, $mdDialog, Customers, SharedUtil
        ) {
            this.$timeout = $timeout;
            this.$document = $document;
            this.$mdDialog = $mdDialog;
            this.Customers = Customers;
            this.daysBetween = SharedUtil.daysBetween;
            this.isToday = SharedUtil.isToday;
            Customers.get({
                id: this.customer_id
            }, (customer) => {
                this.customer = customer;
                this.findNewOrders();
            });
        }

        findNewOrders() {
            if (this.customer.orders.length === 0) {
                return false;
            }
            this.newOrders = [];
            this.todayOrders = [];
            for (var i = 0; i < this.customer.orders.length; i++) {
                let order = this.customer.orders[i];
                if (!order.isCanceled &&
                    !order.notShowup &&
                    !order.checkIn &&
                    !order.isPaid &&
                    !order.checkOutAt
                ) {
                    if (this.isToday(order.scheduleAt)) {
                        this.todayOrders.push(order);
                    } else if (this.daysBetween(order.scheduleAt) > 0) {
                        this.newOrders.push(order);
                    }
                }
            }
        }

        selectAndConfirm(type, selectItem) {
            selectItem = selectItem || {};
            selectItem.type = type;
            selectItem.customer = this.customer;
            console.log(selectItem);
            this.$mdDialog.hide(selectItem);
        }

        cancel() {
            this.$mdDialog.cancel();
        }

    },
    clickOutsideToClose: false,
    bindToController: true,
    controllerAs: '$ctrl'
});
