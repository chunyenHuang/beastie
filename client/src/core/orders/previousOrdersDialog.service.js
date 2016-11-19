import template from './previousOrdersDialog.html';
import './previousOrdersDialog.styl';

/* @ngInject */
class previousOrdersDialog {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
        this.$document = $document;
        this.$mdDialog = $mdDialog;
        // this.Signatures = Signatures;
        if (!$document[0].getElementById('previous-orders-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', 'previous-orders-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(locals,
                    $document[0].getElementById('previous-orders-dialog')
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
            controller: /* @ngInject */ class previousOrdersDialogController {
                static get $inject() {
                    return [
                        '$injector', '$timeout', '$window', '$mdDialog',
                        'Orders'
                    ];
                }
                constructor(
                    $injector, $timeout, $window, $mdDialog,
                    Orders
                ) {
                    this.$injector = $injector;
                    this.$timeout = $timeout;
                    this.$window = $window;
                    this.$mdDialog = $mdDialog;
                    this.Orders = Orders;

                    this.pictures ={};
                    this.orders = [];
                    this.Orders.query({
                        pet_id: this.pet_id
                    }, (res) => {
                        this.orders = res;
                        angular.forEach(this.orders, (order)=>{
                            this.Orders.getPicturesPath({
                                id: order._id
                            }, (res)=>{
                                this.pictures[order._id] = res;
                            });
                        });
                    });
                }

                close() {
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

export default previousOrdersDialog;
