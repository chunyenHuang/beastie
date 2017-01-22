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
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(locals,
                    $document[0].body
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
                        this.orders = res.reverse();
                        angular.forEach(this.orders, (order)=>{
                            this.Orders.getPicturesPath({
                                id: order._id
                            }, (res)=>{
                                this.pictures[order._id] = res.reverse();
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
