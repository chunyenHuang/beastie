import template from './chooseServiceDialog.html';
import './chooseServiceDialog.styl';

/* @ngInject */
class showSignaturesDialog {
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
            locals: {
                order: locals.order
            },
            parent,
            template,
            controller: /* @ngInject */ class showSignaturesDialogController {
                static get $inject() {
                    return [
                        '$injector', '$timeout', '$window', '$mdDialog',
                        'Signatures', 'ListItems', 'Socket', 'Orders'
                    ];
                }
                constructor(
                    $injector, $timeout, $window, $mdDialog,
                    Signatures, ListItems, Socket, Orders
                ) {
                    this.$mdDialog = $mdDialog;
                    this.Orders = Orders;

                    ListItems.query({
                        type: 'services'
                    }, (list) => {
                        this.services = list[0].items;
                    });
                }
                setService(service) {
                    this.service = service;
                }
                submit() {
                    this.Orders.update({
                        id: this.order._id
                    }, {
                        services: this.service
                    }, (data) => {
                        this.$mdDialog.hide();
                        return data;
                    });
                }
                cancel() {
                    this.$mdDialog.cancel('cancel');
                }
            },
            clickOutsideToClose: false,
            bindToController: true,
            controllerAs: '$ctrl'
        };
    }
}

export default showSignaturesDialog;
