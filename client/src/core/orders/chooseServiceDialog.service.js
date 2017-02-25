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

                    const listPromises = [];
                    angular.forEach(['services', 'serviceAddons'], (item) => {
                        listPromises.push(ListItems.query({
                            type: item
                        }).$promise);
                    });
                    Promise.all(listPromises).then((lists) => {
                        this.services = lists[0][0].items;
                        this.serviceAddons = lists[1][0].items;

                        this.newServices = angular.copy(this.order.services || this.services[0]);
                        this.newServiceAddons = angular.copy(this.order.serviceAddons || []);
                    });
                }
                setService(service) {
                    this.newServices = service;
                }

                isAdded(addon) {
                    return this.newServiceAddons.find((element) => {
                        return element.keyID === addon.keyID;
                    });
                }

                toggleServiceAddon(addon) {
                    if (this.isAdded(addon)) {
                        const pos = this.newServiceAddons.findIndex((element) => {
                            return element.keyID === addon.keyID;
                        });
                        this.newServiceAddons.splice(pos, 1);
                    } else {
                        this.newServiceAddons.push(addon);
                    }
                }

                getTotal() {
                    if (!this.newServiceAddons || !this.newServices) {
                        return 0;
                    }
                    return this.newServiceAddons.reduce((total, element) => {
                        return total + element.price;
                    }, this.newServices.price);
                }

                submit() {
                    this.Orders.update({
                        id: this.order._id
                    }, {
                        services: this.newServices,
                        serviceAddons: this.newServiceAddons
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