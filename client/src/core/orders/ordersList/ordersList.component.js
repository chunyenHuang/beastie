import template from './ordersList.html';
import './ordersList.styl';
import quickStartDialog from '../../quickStart.dialog';

const ordersListComponent = {
    template,
    bindings: {
        type: '@'
    },
    controller: /* @ngInject */ class OrdersListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Orders', 'Pets', 'SharedUtil', 'Customers', '$mdColors',
                'Snapshot', 'InhouseOrdersDialog', 'ShowSignaturesDialog',
                'PreviousOrdersDialog', 'Socket', '$mdDialog', '$mdToast',
                'chooseServiceDialog', '$location', '$anchorScroll', 'Transactions',
                '$document', 'TransactionsDialog', 'CustomerDetailDialog', '$mdMedia'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders, Pets, SharedUtil, Customers, $mdColors,
            Snapshot, InhouseOrdersDialog, ShowSignaturesDialog,
            PreviousOrdersDialog, Socket, $mdDialog, $mdToast,
            chooseServiceDialog, $location, $anchorScroll, Transactions,
            $document, TransactionsDialog, CustomerDetailDialog, $mdMedia
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
            this.Pets = Pets;
            this.getDayName = SharedUtil.getDayName;
            this.isToday = SharedUtil.isToday;
            this.capitalizeStr = SharedUtil.capitalizeStr;

            this.Customers = Customers;
            this.$mdColors = $mdColors;
            this.Snapshot = Snapshot;
            this.InhouseOrdersDialog = InhouseOrdersDialog;
            this.ShowSignaturesDialog = ShowSignaturesDialog;
            this.PreviousOrdersDialog = PreviousOrdersDialog;
            this.$mdDialog = $mdDialog;
            this.$mdToast = $mdToast;
            this.chooseServiceDialog = chooseServiceDialog;
            this.$location = $location;
            this.$anchorScroll = $anchorScroll;
            this.Transactions = Transactions;
            this.$document = $document;
            this.TransactionsDialog = TransactionsDialog;
            this.CustomerDetailDialog = CustomerDetailDialog;
            this.$mdMedia = $mdMedia;

            Socket.on('customerCheckIn', (results) => {
                console.log('customerCheckIn');
                console.log(results);
                let todayStr = new Date(results[0].checkInAt).toDateString();
                angular.forEach(results, (res)=>{
                    if (this.Orders.orders &&
                        this.Orders.orders[todayStr] &&
                        this.Orders.orders[todayStr][res._id]
                    ) {
                        this.Orders.updateCache(res, () => {
                            const pos = this.orders.findIndex((order)=>{
                                return (order._id == res._id);
                            });
                            this.orders.splice(pos, 1, res);
                            this.countOrderType();
                            this.$timeout(() => {
                                this.$stateParams['#'] = res._id;
                            }, 100);
                            this.$timeout(() => {
                                this.setType('checkInAt');
                            }, 200);
                            this.$timeout(() => {
                                this.scrollToId(res._id);
                            }, 500);
                        });
                        // let updatedOrder = Object.assign({},
                        //     this.Orders.orders[todayStr][res.order_id], {
                        //         checkInAt: res.checkInAt,
                        //         checkInNumber: res.checkInNumber
                        //     });
                        // this.Orders._setOrderType(updatedOrder);
                        // this.Orders.orders[todayStr][res.order_id] = updatedOrder;
                        // if (this.isHostTrigger) {
                        //     this.isHostTrigger = false;
                        // } else if (this.date.toDateString() === todayStr && !this.isHostTrigger) {
                        //     this.isClientTrigger = true;
                        //     this.changeDate(0, this.date);
                        // }
                    }
                });
                const toast = this.$mdToast.simple()
                    .textContent('A Customer Just Checked-In!')
                    .highlightAction(true)
                    .highlightClass('md-accent')
                    .position('top right');
                this.$mdToast.show(toast);
            });
        }

        scrollToId(id) {
            if (id) {
                this.$location.hash(id);
                this.$anchorScroll();
            }
            this.$location.hash(null);
        }

        isHighlited(id) {
            return (this.$stateParams['#'] == id);
        }

        followStateParams() {
            if (this.isClientTrigger) {
                this.isClientTrigger = false;
            } else {
                this.setType(this.$stateParams.type);
                if (this.$stateParams['#']) {
                    this.$timeout(() => {
                        this.scrollToId(this.$stateParams['#']);
                    }, 500);
                }
            }
        }

        setType(key) {
            key = key || 'all';
            this.showType = key;
            key === 'all' ? this.showAllTypes = true : this.showAllTypes = false;
            key === 'checkInAt' || 'processing' ? this.orderBy = 'checkInNumber' : this.orderBy = 'scheduleAt';
            if (key === 'upcoming') {
                this.$timeout(() => {
                    this.scrollToId('top');
                }, 0);
            }
        }

        $onInit() {
            this.calOpen = false;
            this.i = 0;
            this.changeDate(0, new Date());
            this.schedules = [];
            this.dateModeList = ['today'];
            this.dateMode = 'date';
            this.typeList = {
                all: {
                    text: 'all',
                    css: 'md-primary'
                },
                upcoming: {
                    text: 'upcoming',
                    css: 'md-primary'
                },
                checkInAt: {
                    text: 'checked-in',
                    css: 'md-primary'
                },
                processing: {
                    text: 'processing',
                    css: 'md-primary'
                },
                checkOutAt: {
                    text: 'checked-out',
                    css: 'md-primary'
                }
            };
            this.orderBy = 'scheduleAt';
            this.orderFlags = {
                isCanceled: false,
                notShowup: false,
                checkInAt: null,
                isPaid: false,
                checkOutAt: null
            };
        }

        genConfirmDialog(order, text) {
            let name = this.capitalizeStr(order.customers[0].firstname);
            let title = '',
                ariaLabel = '',
                textContent = '';
            if (text === 'checkout') {
                title = 'Is ' + name + ' Paying by Cash?';
                ariaLabel = 'paid by cash';
            } else {
                title = 'Are you setting ' + name + "'s order to " + text + '?';
                ariaLabel = 'confirm ' + text;
            }
            this.confirm = this.$mdDialog.confirm()
                .title(title)
                .textContent(textContent)
                .ariaLabel(ariaLabel)
                .ok('YES')
                .cancel('NO');
        }

        getToday() {
            return new Date();
        }

        changeDate(offset, date) {
            offset = offset || 0;
            date = date || this.date;
            this.date = new Date(date.setDate(date.getDate() + offset));
            this.getOrders(this.date);
        }

        getOrders(date) {
            this.Orders.getCache(date).then((orders) => {
                this.$timeout(() => {
                    this.orders = [];
                    for (let prop in orders) {
                        this.orders.push(orders[prop]);
                    }
                    this.countOrderType();
                    this.followStateParams();
                }, 20);
            });
        }

        _resetOrderCount() {
            angular.forEach(this.typeList, (type) => {
                type.count = 0;
            });
        }

        countOrderType() {
            this._resetOrderCount();
            angular.forEach(this.orders, (order) => {
                this.typeList.all.count += 1;
                if (order.type) {
                    this.typeList[order.type].count += 1;
                }
            });
        }

        customerDetail(customer_id, order, entry) {
            let index = this.orders.indexOf(order);
            this.CustomerDetailDialog({
                customer_id: customer_id,
                tab: entry,
                isFromOrdersList: true
            }).then(() => {
                this.Orders.get({
                    id: order._id
                }, (newOrder) => {
                    this.Orders.updateCache(newOrder, () => {
                        this.orders.splice(index, 1, newOrder);
                    });
                });
            }, () => {});
        }

        showPreviousOrders(order) {
            this.PreviousOrdersDialog({
                order_id: order._id,
                pet_id: order.pet_id,
                customer_id: order.customer_id
            }).then(() => {});
        }

        takeSnapshot(pet_id, order) {
            let index = this.orders.indexOf(order);
            if (!pet_id) {
                return;
            }
            this.Snapshot().then((res) => {
                const timestamp = new Date().getTime();

                this.Pets.uploadPicture({
                    id: pet_id
                }, {
                    pet_id: pet_id,
                    file: res.blob,
                    filename: pet_id + '-' + timestamp + '-' + order._id + '.png'
                }, (res) => {
                    order.pictures.push(res.url);
                    this.Orders.updateCache(order, () => {
                        this.orders.splice(index, 1, order);
                    });
                }, () => {});
            });
        }

        chooseService(order) {
            let index = this.orders.indexOf(order);
            this.chooseServiceDialog({
                order: order
            }).then(() => {
                this.orders.splice(index, 1, this.Orders.getOneCache(order));
                this.countOrderType();
            });
        }

        waivers(order) {
            this.ShowSignaturesDialog({
                customer_id: order.customer_id,
                order_id: order._id
            }).then(() => {});
        }

        edit(order) {
            this.resetOrder(order, () => {
                this.$state.go('core.orders.form', {
                    order_id: order._id
                });
            });
        }

        inhouseOdrer(order_id, order) {
            let index = this.orders.indexOf(order);
            this.InhouseOrdersDialog({
                order_id: order_id
            }).then((res) => {
                if (res._id) {
                    this.orders.splice(index, 1, res);
                    this.countOrderType();
                }
            });
        }

        getTotal(order) {
            let total;
            if (!order) {
                total = '';
            } else if (!order.services) {
                total = order.total || '';
            } else {
                total = order.total || order.services.price || '';
            }
            return total;
        }

        changeTotal(order) {
            let index = this.orders.indexOf(order);
            let oriMoney = order.total || order.services.price;
            this.$mdDialog.show(
                quickStartDialog({
                    element: 'order-list',
                    oriMoney: oriMoney
                }, this.$document[0].getElementById('order-list'))
            ).then((money) => {
                this.Orders.update({
                    id: order._id
                }, {
                    total: money
                }, (data) => {
                    if (data._id) {
                        this.orders.splice(index, 1, data);
                        this.countOrderType();
                    }
                });
            }, () => {});
        }

        checkout(order) {
            this.TransactionsDialog({
                order_id: order._id
            }).then(
                (res) => {
                    this.Orders.updateCache(res, () => {
                        this.changeDate(0, new Date());
                    });
                }, () => {}
            );
        }

        update(order) {
            this.Orders.update({
                id: order._id
            }, order, () => {
                this.refreshOrders();
            });
        }

        refreshOrders() {
            this.Orders.getCache().then((orders) => {
                this.orders = orders;
            });
        }

        checkIn(order) {
            this.isHostTrigger = true;
            let orderDate = new Date(order.scheduleAt);
            if (orderDate.toDateString() === new Date().toDateString()) {
                this.resetOrder(order, () => {
                    this.Customers.checkIn({
                        phone: order.customers[0].phone
                    }, () => {
                        // angular.forEach(results, (result) => {
                        //     this.Orders.updateCache(result, () => {
                        //         const pos = this.orders.findIndex((order)=>{
                        //             return (order._id == result._id);
                        //         });
                        //         this.orders.splice(pos, 1, result);
                        //         this.countOrderType();
                        //         this.$timeout(() => {
                        //             this.$stateParams['#'] = result._id;
                        //         }, 100);
                        //         this.$timeout(() => {
                        //             this.setType('checkInAt');
                        //         }, 200);
                        //         this.$timeout(() => {
                        //             this.scrollToId(result._id);
                        //         }, 500);
                        //     });
                        // });
                    });
                });
            } else {
                this.genConfirmDialog(order, 'CHECK IN');
                this.$mdDialog.show(this.confirm).then(() => {
                    this.Orders.update({
                        id: order._id
                    }, Object.assign(order, this.orderFlags, {
                        scheduleAt: new Date()
                    }), () => {
                        this.Customers.checkIn({
                            phone: order.customers[0].phone
                        }, () => {
                            this.changeDate(0, new Date());
                        });
                    });
                }, () => {});
            }
        }

        resetOrder(order, callback) {
            let index = this.orders.indexOf(order);
            this.Orders.update({
                id: order._id
            }, {
                isCanceled: false,
                notShowup: false,
                checkInAt: null,
                checkInNumber: null,
                isPaid: false,
                checkOutAt: null
            }, (data) => {
                if (data._id) {
                    this.orders.splice(index, 1, data);
                    this.countOrderType();
                    if (callback) {
                        return callback();
                    }
                }
            });
        }

        confirmResetOrder(order) {
            let name = this.capitalizeStr(order.customers[0].firstname);
            let confirm = this.$mdDialog.confirm()
                .title('Are you resetting ' + name + "'s order to UPCOMING?")
                .textContent('If YES, it will lose its check-in number.')
                .ariaLabel('confirm reset')
                .ok('YES')
                .cancel('NO');
            this.$mdDialog.show(confirm).then(() => {
                this.resetOrder(order);
            }, () => {});
        }

        resetCheckOut(order) {
            let index = this.orders.indexOf(order);
            this.Orders.update({
                id: order._id
            }, {
                checkOutAt: null,
                isPaid: false
            }, (data) => {
                if (data._id) {
                    this.orders.splice(index, 1, data);
                    this.countOrderType();
                }
            });

            this.Transactions.query({
                order_id: order._id
            }, (data) => {
                this.Transactions.delete({
                    id: data[0]._id
                }, () => {});
            });
        }

        cancel(order) {
            if (!order.isCanceled) {
                let index = this.orders.indexOf(order);
                this.genConfirmDialog(order, 'CANCEL');
                this.$mdDialog.show(this.confirm).then(() => {
                    this.Orders.update({
                        id: order._id
                    }, {
                        isCanceled: true,
                        notShowup: false,
                        checkInAt: null,
                        isPaid: false,
                        checkOutAt: null
                    }, (data) => {
                        if (data._id) {
                            this.orders.splice(index, 1, data);
                            this.countOrderType();
                        }
                    });
                }, () => {});
            }
        }

        notShowup(order) {
            if (!order.notShowup) {
                let index = this.orders.indexOf(order);
                this.genConfirmDialog(order, 'NO-SHOW');
                this.$mdDialog.show(this.confirm).then(() => {
                    this.Orders.update({
                        id: order._id
                    }, {
                        isCanceled: false,
                        notShowup: true,
                        checkInAt: null,
                        isPaid: false,
                        checkOutAt: null
                    }, (data) => {
                        if (data._id) {
                            this.orders.splice(index, 1, data);
                            this.countOrderType();
                        }
                    });
                }, () => {});
            }
        }
    }
};
export default ordersListComponent;
