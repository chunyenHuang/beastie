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
            this.SharedUtil = SharedUtil;
            Customers.get({
                id: this.customer_id
            }, (customer)=>{
                this.customer = customer;
                this.setSelectItems();
                console.info(this.customer);
            });
        }

        isTodaysOrder(){
            const today = new Date();

        }

        hasNewOrder(){
            console.log(this.customer.orders);
            if(this.customer.orders.length === 0 ){
                return false;
            }
            for (var i = 0; i < this.customer.orders.length; i++) {
                let order = this.customer.orders[i];
                if(
                    !order.isCanceled &&
                    !order.notShowup &&
                    !order.checkIn &&
                    !order.isPaid &&
                    !order.checkOutAt
                ) {
                    return order;
                }
            }
            return false;
        }

        setSelectItems(){
            this.newOrder = this.hasNewOrder();
            this.selectItems = [{
                label: 'Info',
                value: 'viewCustomer',
                show: true
            },{
                label: 'Check In',
                value: 'checkIn',
                phone: this.customer.phone,
                show: (!this.newOrder)?false:((this.SharedUtil.isWithinToday(this.newOrder.scheduleAt))?true: false)
            }, {
                label: 'Edit Order',
                value: 'editOrder',
                order_id: this.newOrder._id,
                show: (this.newOrder)?true:false
            }, {
                label: 'New Order',
                value: 'newOrder',
                show: (!this.newOrder)?true:false
            }];
        }

        selectAndConfirm(selectItem){
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
