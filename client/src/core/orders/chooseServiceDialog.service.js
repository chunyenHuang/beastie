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
        // this.Signatures = Signatures;
        if (!$document[0].getElementById('choose-service-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', 'choose-service-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(locals,
                    $document[0].getElementById('choose-service-dialog')
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
                    // this.$injector = $injector;
                    // this.$timeout = $timeout;
                    // this.$window = $window;
                    this.$mdDialog = $mdDialog;
                    // this.Socket = Socket;
                    this.Orders = Orders;
                    
                    ListItems.query({
                        type: 'services'
                    }, (list) => {
                        this.services = list[0].items;
                        console.log(this.services);
                    });
                }
                setService(service) {
                    this.service = service;
                    console.log(this.order);
                }
                submit() {
                    this.Orders.update({
                        id: this.order._id
                    }, {
                        services: this.service
                    }, (data) => {
                        console.log(data);
                        this.$mdDialog.hide();
                        return data;
                        
                    })
                    // console.log(this.order);
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
