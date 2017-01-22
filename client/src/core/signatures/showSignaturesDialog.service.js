import template from './showSignaturesDialog.html';
import './showSignaturesDialog.styl';

/* @ngInject */
class showSignaturesDialog {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
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
                customer_id: locals.customer_id,
                order_id: locals.order_id
            },
            parent,
            template,
            controller: /* @ngInject */ class showSignaturesDialogController {
                static get $inject() {
                    return [
                        '$injector', '$timeout', '$window', '$mdDialog',
                        'Signatures', 'ListItems', 'Socket'
                    ];
                }
                constructor(
                    $injector, $timeout, $window, $mdDialog,
                    Signatures, ListItems, Socket
                ) {
                    this.$injector = $injector;
                    this.$timeout = $timeout;
                    this.$window = $window;
                    this.$mdDialog = $mdDialog;
                    this.Signatures = Signatures;
                    this.Socket = Socket;
                    ListItems.query({
                        type: 'waivers'
                    }, (list) => {
                        this.waivers = list[0].items;
                    });
                    this.checkSignatures();
                    this.Socket.on('signaturesFinished', () => {
                        this.checkSignatures();
                    });
                }

                checkSignatures() {
                    this.Signatures.query({
                        customer_id: this.customer_id
                    }, (res) => {
                        this.signed = res;
                    });
                }

                askToSign(waiverName) {
                    this.Signatures.init({
                        customer_id: this.customer_id,
                        order_id: this.order_id,
                        name: waiverName
                    });
                }

                isSigned(waiverName) {
                    if (!this.signed) {
                        return;
                    }
                    for (var i = 0; i < this.signed.length; i++) {
                        if (
                            this.signed[i].name == waiverName &&
                            this.signed[i].order_id == this.order_id
                        ) {
                            return true;
                        }
                    }
                    return false;
                }

                view(waiverName) {
                    this.waiverName = waiverName;
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

export default showSignaturesDialog;
