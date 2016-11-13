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
        constructor($log, $timeout, $document, $http, $state, $stateParams, InhouseOrders, ListItems, Orders) {
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
            this.order_id = this.$stateParams.order_id;

            this.Orders.get({
                id: this.order_id
            }, (order) => {
                this.order = order;
                this.ListItems.query({
                    type: 'inhouseOrders'
                }, (datas) => {
                    this.list = datas[0].items;
                    this.populateInhouseOrders();
                });
            });
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
            this.order.inhouseOrders = this.inhouseOrders;
            this.order.$update({
                id: this.order_id
            }, (res) => {
                console.info(res);
                // this.formatOrderForm();
                this.print();
            }, (err) => {
                console.error(err);
            });
        }

        drawImage(callback) {
            const texts = [];
            for (let type in this.inhouseOrders) {
                if (this.inhouseOrders[type].value.length > 0) {
                    angular.forEach(this.inhouseOrders[type].value, (value) => {
                        const text = value.name + ' ' +
                            ((value.name != value.zhName) ? value.zhName : '');
                        texts.push(text);
                    });
                }
            }

            const canvas = this.$document[0].getElementById('inhouse-orders-canvas');
            canvas.width = 500;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            const margin = {
                top: 50,
                left: 20
            };
            const lineHeight = 60;
            canvas.width = 500;
            canvas.height = margin.top * 2 + lineHeight * texts.length;

            let nextY = margin.top;
            ctx.font = '40px Georgia';
            ctx.fillText('*', margin.left, nextY);
            for (var x = 0; x < texts.length; x++) {
                nextY += lineHeight;
                ctx.fillText(texts[x], margin.left, nextY);
            }
            // const dataUrl = canvas.toDataURL('image/png', 0.5);
            // const image = ctx.getImageData(
            //     0, 0, canvas.width, canvas.height
            // );
            canvas.toBlob((blob)=> {
                // const url = URL.createObjectURL(blob);
                callback(blob);
            });


        }

        print() {
            this.drawImage((blob) => {
                const formData = new FormData();
                formData.append('file', blob);
                formData.append('filename', this.order_id + '.png');
                formData.append('order_id', this.order_id);
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
                );
            });
        }

        // formatOrderForm() {
        //     this.format = {};
        //     for (var prop in this.inhouseOrders) {
        //         if (this.inhouseOrders[prop].value.length > 0) {
        //             this.format[prop] = this.inhouseOrders[prop].value;
        //         }
        //     }
        // }
    }
};
export default inhouseOrdersComponent;
