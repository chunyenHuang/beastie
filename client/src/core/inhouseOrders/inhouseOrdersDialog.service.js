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

                    if (this.order_id) {
                        this.order_id = this.order_id;
                        this.Orders.get({
                            id: this.order_id
                        }, (order) => {
                            this.order = order;
                            console.log(this.order);
                            this.message = 'order id: ' + this.order_id;
                            this.ListItems.query({
                                type: 'inhouseOrders'
                            }, (datas) => {
                                this.list = datas[0].items;
                                this.populateInhouseOrders();
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
                    this.populateInhouseOrders('reset');
                }

                updateOrder(){
                    this.Orders.update({
                        id: this.order_id
                    }, {
                        isRush: this.order.isRush
                    }, (res)=>{
                        console.log(res);
                    });
                }

                populateInhouseOrders(reset) {
                    angular.forEach(this.list, (listItem) => {
                        let value = [];
                        if (this.order.inhouseOrders && this.order.inhouseOrders[listItem.name]) {
                            value = this.order.inhouseOrders[listItem.name].value;
                        }
                        if (reset) {
                            value = [];
                        }
                        this.inhouseOrders[listItem.name] = {
                            type: listItem.type,
                            multiple: listItem.multiple,
                            name: listItem.name,
                            zhName: listItem.zhName,
                            value: value
                        };
                    });
                }

                assignToOrder(key, item) {
                    if (this.inhouseOrders[key].multiple) {
                        if (this.isInOrder(key, item)) {
                            this.inhouseOrders[key].value.splice(this.findInOrder(key, item), 1);
                        } else {
                            this.inhouseOrders[key].value.push(item);
                        }
                    } else {
                        this.inhouseOrders[key].value = [item];
                    }
                    this.$timeout(() => {
                        this.inhouseOrders = this.inhouseOrders;
                    });
                }

                findInOrder(key, item) {
                    const value = this.inhouseOrders[key].value;
                    for (var i = 0; i < value.length; i++) {
                        if (
                            value[i].name == item.name &&
                            value[i].zhName == item.zhName
                        ) {
                            return i;
                        }
                    }
                    return -1;
                }

                isInOrder(key, item) {
                    if (!this.inhouseOrders || !key || !item) {
                        return false;
                    } else {
                        return (this.findInOrder(key, item) > -1) ? true : false;
                    }
                }

                submit() {
                    if (this.order_id) {
                        this.order.inhouseOrders = this.inhouseOrders;
                        if (this.order.scheduleAt) { delete this.order.scheduleAt }
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
                    for (let type in this.inhouseOrders) {
                        if (this.inhouseOrders[type].value.length > 0) {
                            angular.forEach(this.inhouseOrders[type].value, (value) => {
                                const text = type + ': ' + value.name +
                                    ' ' + ((value.name != value.zhName) ? value.zhName : '');
                                texts.push(text);
                            });
                        }
                    }

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
                            if(this.order){
                                console.log(this.orders);
                                formData.append('customerName', this.order.customers[0].firstname + ' ' + this.order.customers[0].lastname);
                                formData.append('customerPhone', this.order.customers[0].phone);
                                formData.append('petName', this.order.pets[0].name);
                                formData.append('petInfo', this.order.pets[0].breed + ' ' + this.order.pets[0].color);
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
