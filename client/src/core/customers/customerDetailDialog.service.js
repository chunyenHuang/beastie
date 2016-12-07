import template from './customerDetailDialog.html';
import './customerDetailDialog.styl';

/* @ngInject */
class customerDetailDialog {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
        this.$document = $document;
        this.$mdDialog = $mdDialog;
        // this.Signatures = Signatures;
        if (!$document[0].getElementById('customer-detail-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', 'customer-detail-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(locals,
                    $document[0].getElementById('customer-detail-dialog')
                )
            );
        };
        return showDialog;
    }
    dialog(locals, parent) {
        return {
            locals,
            parent,
            template,
            controller: /* @ngInject */ class customerDetailDialogController {
                static get $inject() {
                    return [
                        '$log', '$timeout', '$document', '$mdDialog',
                        'Customers', 'Pets', 'Orders'
                    ];
                }
                constructor(
                    $log, $timeout, $document, $mdDialog,
                    Customers, Pets, Orders
                ) {
                    this.$log = $log;
                    this.$timeout = $timeout;
                    this.$document = $document;
                    this.$mdDialog = $mdDialog;
                    this.Customers = Customers;
                    this.Pets = Pets;
                    this.Orders = Orders;

                    this.pictures = {};

                    this.Customers.get({
                        id: this.customer_id
                    }, (customer) => {
                        console.log(customer);
                        this.customer = customer;
                    });

                    switch (this.tab) {
                        case 'gallery':
                            this.selectedTab = 0;
                            break;
                        case 'customer':
                            this.selectedTab = 1;
                            break;
                        default:
                            this.selectedTab = 0;
                    }
                }

                update(customer) {
                    if (!customer._id) {
                        this.create(customer);
                    }
                    customer.$update({
                        id: customer._id
                    }, (res) => {
                        if (this.isFromOrdersList) {
                            this.$mdDialog.hide(res);
                        }
                        console.log(res);
                    });
                }

                updatePet(pet) {
                    console.log(pet)
                    if (!pet._id) {
                        return;
                        // this.create(pet);
                    }
                    this.Pets.update({
                        id: pet._id
                    }, pet, (res) => {
                        if (this.isFromOrdersList) {
                            this.$mdDialog.hide(res);
                        }
                        console.log(res);
                    });
                }

                create(customer) {
                    this.Customers.save(customer, (res) => {
                        console.log(res);
                    });
                }

                getTemplate(callback) {
                    this.Users.get({
                        id: 'template'
                    }, callback);
                }

                toggleLargePic(url) {
                    if (!this.previewLargeUrl) {
                        this.previewLargeUrl = url;
                        // ng-show="$ctrl.previewLargeUrl"
                        // dom ng-click="$ctrl.previewLargeUrl=null"
                        this.$document[0].getElementById('preview-large').classList.remove('hide');
                    } else {
                        this.previewLargeUrl = null;
                        this.$document[0].getElementById('preview-large').classList.add('hide');
                    }
                }

                cancel() {
                    this.$mdDialog.cancel('cancel');
                }

                done() {
                    this.$mdDialog.hide();
                }
            },
            clickOutsideToClose: false,
            bindToController: true,
            controllerAs: '$ctrl'
        };
    }
}

export default customerDetailDialog;
