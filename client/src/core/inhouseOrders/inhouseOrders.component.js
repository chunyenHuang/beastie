import template from './inhouseOrders.html';
import './inhouseOrders.styl';

const inhouseOrdersComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class InhouseOrdersController {
        static get $inject() {
            return [
                '$log', '$timeout', '$document', '$http', '$state', '$stateParams',
                'InhouseOrders', 'ListItems', 'Orders'
            ];
        }
        constructor(
            $log, $timeout, $document, $http, $state, $stateParams,
            InhouseOrders, ListItems, Orders
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$document = $document;
            this.$http = $http;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.InhouseOrders = InhouseOrders;
            this.ListItems = ListItems;
            this.Orders = Orders;
        }

        $onInit() {
            this.inhouseOrders = {};

            if (this.$stateParams.order_id) {
                this.order_id = this.$stateParams.order_id;
                this.Orders.get({
                    id: this.order_id
                }, (order) => {
                    this.order = order;
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
            if (this.$stateParams.order_id) {
                this.order.inhouseOrders = this.inhouseOrders;
                this.order.$update({
                    id: this.order_id
                }, () => {
                    this.print(() => {
                        this.$state.go('core.orders.list');
                    });
                }, () => {});
            } else {
                this.print(() => {
                    this.$state.go('core.orders.list');
                });
            }
        }

        drawImage(callback) {
            const texts = [];
            for (let type in this.inhouseOrders) {
                if (this.inhouseOrders[type].value.length > 0) {
                    angular.forEach(this.inhouseOrders[type].value, (value) => {
                        const text = this.inhouseOrders[type].type + ': ' + value.name +
                            ' ' + ((value.name != value.zhName) ? value.zhName : '');
                        texts.push(text);
                    });
                }
            }
            console.warn(texts);
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
                } else {
                    formData.append('filename', 'inhouseOrders.png');
                }
                this.$http.post(
                    '/inhouseOrders',
                    formData, {
                        headers: {
                            'Content-Type': undefined
                        }
                        // eventHandlers: {
                        //     progress: () => {}
                        // },
                        // uploadEventHandlers: {
                        //     progress: (event) => {
                        //         console.log(event.loaded / event.total);
                        //     }
                        // }
                    }
                ).then(() => {
                    callback();
                }, () => {
                    callback();
                });
            });
        }
    }
};
export default inhouseOrdersComponent;
