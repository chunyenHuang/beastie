import template from './inhouseOrdersDialog.html';
import './inhouseOrdersDialog.styl';

/* @ngInject */
class inhouseOrdersDialog {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
        this.$document = $document;
        this.$mdDialog = $mdDialog;
        // this.Signatures = Signatures;
        if (!$document[0].getElementById('inhouse-orders-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', 'inhouse-orders-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(locals,
                    $document[0].getElementById('inhouse-orders-dialog')
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
            controller: /* @ngInject */ class inhouseOrdersDialogController {
                static get $inject() {
                    return [
                        '$log', '$timeout', '$document', '$http',
                        '$mdDialog',
                        'InhouseOrders', 'ListItems', 'Orders'
                    ];
                }
                constructor(
                    $log, $timeout, $document, $http, $mdDialog,
                    InhouseOrders, ListItems, Orders
                ) {
                    this.$log = $log;
                    this.$timeout = $timeout;
                    this.$document = $document;
                    this.$http = $http;
                    this.$mdDialog = $mdDialog;
                    this.InhouseOrders = InhouseOrders;
                    this.ListItems = ListItems;
                    this.Orders = Orders;

                    this.inhouseOrders = {};
                    this.previewIndex = 0;

                    if (this.order_id) {
                        this.order_id = this.order_id;
                        this.Orders.get({
                            id: this.order_id
                        }, (order) => {
                            this.order = order;
                            this.message = 'order id: ' + this.order_id;
                            this.applyPreviousOrder(order);
                            this.ListItems.query({
                                type: 'inhouseOrders'
                            }, (datas) => {
                                this.list = datas[0].items;
                                this.populateInhouseOrders();
                            });
                            this.Orders.query({
                                pet_id: this.order.pet_id,
                                // isCanceled: false,
                                // isPaid: true,
                                // notShowup: false
                            }).$promise.then((orders) => {
                                console.log(orders);
                                this.previousOrders = orders;
                            });
                        });
                    } else {
                        this.order = {
                            inhouseOrders: []
                        };
                        this.message = 'no order id';
                        this.ListItems.query({
                            type: 'inhouseOrders'
                        }, (datas) => {
                            this.list = datas[0].items;
                            this.populateInhouseOrders();
                        });
                    }
                }

                reset() {
                    this.populateInhouseOrders(null, 'reset');
                }

                updateOrder() {
                    this.Orders.update({
                        id: this.order_id
                    }, {
                        isRush: this.order.isRush
                    }, (res) => {
                        console.log(res);
                    });
                }

                populateInhouseOrders(sourceOrder, reset) {
                    const source = (sourceOrder) ?
                        sourceOrder.inhouseOrders : this.order.inhouseOrders;
                    angular.forEach(this.list, (listItem) => {
                        let value = [];
                        if (source && source[listItem.keyID]) {
                            value = source[listItem.keyID].value;
                        }
                        if (reset) {
                            value = [];
                        }
                        console.warn(listItem);
                        this.inhouseOrders[listItem.keyID] = {
                            type: listItem.type,
                            multiple: listItem.multiple,
                            name: listItem.name,
                            zhName: listItem.zhName,
                            keyID: listItem.keyID,
                            value: value
                        };
                    });
                }

                assignToOrder(keyID, item) {
                    if (this.isInOrder(keyID, item)) {
                        this.inhouseOrders[keyID].value.splice(
                            this.findInOrder(keyID, item), 1
                        );
                    } else if (this.inhouseOrders[keyID].multiple) {
                        this.inhouseOrders[keyID].value.push(item);
                    } else {
                        this.inhouseOrders[keyID].value = [item];
                    }
                    this.$timeout(() => {
                        this.inhouseOrders = this.inhouseOrders;
                    });
                }

                findInOrder(keyID, item) {
                    const value = this.inhouseOrders[keyID].value;
                    for (var i = 0; i < value.length; i++) {
                        if (value[i].keyID == item.keyID) {
                            return i;
                        }
                    }
                    return -1;
                }

                isInOrder(keyID, item) {
                    if (!this.inhouseOrders || !keyID || !item) {
                        return false;
                    } else {
                        return (this.findInOrder(keyID, item) > -1) ? true : false;
                    }
                }

                applyPreviousOrder(previousOrder) {
                    this.previewIndex = 0;
                    this.selectedPreviouseOrder = previousOrder;
                    this.selectedPreviouseOrderPictures = [];
                    this.populateInhouseOrders(previousOrder);
                    if (previousOrder) {
                        for (var i = 0; i < previousOrder.pictures.length; i++) {
                            if (previousOrder.pictures[i].indexOf(previousOrder._id) > -1) {
                                this.selectedPreviouseOrderPictures.push(previousOrder.pictures[i]);
                            }
                        }
                    }
                }

                changePreview(num) {
                    this.previewIndex += num;
                    if (this.previewIndex < 0) {
                        this.previewIndex = (this.selectedPreviouseOrderPictures.length - 1);
                    }
                    if (this.previewIndex > (this.selectedPreviouseOrderPictures.length - 1)) {
                        this.previewIndex = 0;
                    }
                }

                submit() {
                    console.log(this.inhouseOrders);
                    if (this.order_id) {
                        this.order.inhouseOrders = this.inhouseOrders;
                        if (this.order.scheduleAt) {
                            delete this.order.scheduleAt;
                        }
                        this.order.$update({
                            id: this.order_id
                        }, (res) => {
                            // this.formatOrderForm();
                            // this.$mdDialog.hide(res);
                            this.print(() => {
                                this.$mdDialog.hide(res);
                            });
                        }, (err) => {
                            console.error(err);
                        });
                    } else {
                        this.print(() => {
                            this.$mdDialog.hide();
                        });
                    }
                }

                drawImage(callback) {
                    const texts = [];
                    for (let keyID in this.inhouseOrders) {
                        if (this.inhouseOrders[keyID].value.length > 0) {
                            angular.forEach(this.inhouseOrders[keyID].value, (value) => {
                                const text =
                                    this.inhouseOrders[keyID].name + ': ' +
                                    value.name + ' ' +
                                    ((value.name != value.zhName && value.zhName) ?
                                        value.zhName : ''
                                    );
                                texts.push(text);
                            });
                        }
                    }
                    console.log(texts);

                    const canvas = this.$document[0].getElementById('inhouse-orders-canvas');
                    canvas.width = 500;
                    canvas.height = 500;
                    const ctx = canvas.getContext('2d');
                    const margin = {
                        top: -40,
                        left: 20,
                        bottom: 20
                    };
                    const lineHeight = 80;
                    canvas.width = 500;
                    canvas.height = margin.top + lineHeight * texts.length + margin.bottom;

                    let nextY = margin.top;
                    ctx.font = '40px Georgia';
                    ctx.fillText(' ', margin.left, nextY);
                    for (var x = 0; x < texts.length; x++) {
                        nextY += lineHeight;
                        ctx.fillText(texts[x], margin.left, nextY);
                    }
                    // const dataUrl = canvas.toDataURL('image/png', 0.5);
                    // const image = ctx.getImageData(
                    //     0, 0, canvas.width, canvas.height
                    // );
                    canvas.toBlob((blob) => {
                        // const url = URL.createObjectURL(blob);
                        callback(blob);
                    });
                }

                print(callback) {
                    this.drawImage((blob) => {
                        const formData = new FormData();
                        formData.append('file', blob);
                        if (this.order_id) {
                            formData.append('filename', this.order_id + '.png');
                            formData.append('order_id', this.order_id);
                            if (this.order) {
                                const petInfo =
                                    ((this.order.pets[0].breed) ? this.order.pets[0].breed : '') +
                                    ' ' +
                                    ((this.order.pets[0].color) ? this.order.pets[0].color : '');
                                formData.append('customerName', this.order.customers[0].firstname + ' ' + this.order.customers[0].lastname);
                                formData.append('customerPhone', this.order.customers[0].phone);
                                formData.append('petName', this.order.pets[0].name);
                                formData.append('petInfo', petInfo);
                                formData.append('isRush', this.order.isRush);
                                formData.append('checkInNumber', this.order.checkInNumber);
                                formData.append('services', this.order.services);
                            }

                        } else {
                            formData.append('filename', 'inhouseOrders.png');
                        }
                        this.$http.post(
                            '/inhouseOrders',
                            formData, {
                                headers: {
                                    'Content-Type': undefined
                                },
                                eventHandlers: {
                                    progress: () => {}
                                },
                                uploadEventHandlers: {
                                    progress: (event) => {
                                        console.log(event.loaded / event.total);
                                    }
                                }
                            }
                        ).then((res) => {
                            console.log(res);
                            callback();
                        }, (err) => {
                            console.log(err);
                            callback();
                        });
                    });
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

export default inhouseOrdersDialog;
