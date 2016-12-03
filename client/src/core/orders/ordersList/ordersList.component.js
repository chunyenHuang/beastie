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
                '$document'
                
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders, Pets, SharedUtil, Customers, $mdColors,
            Snapshot, InhouseOrdersDialog, ShowSignaturesDialog,
            PreviousOrdersDialog, Socket, $mdDialog, $mdToast, 
            chooseServiceDialog, $location, $anchorScroll, Transactions,
            $document
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
            
            Socket.on('customerCheckIn', (res) => {
                console.log('socket');
                console.log(res);
                let todayStr = new Date(res.checkInAt).toDateString();
                if (this.Orders.orders
                    && this.Orders.orders[todayStr]
                    && this.Orders.orders[todayStr][res.order_id]) {
                    let updatedOrder = Object.assign({}, 
                        this.Orders.orders[todayStr][res.order_id],
                        { checkInAt: res.checkInAt, checkInNumber: res.checkInNumber });
                    this.Orders._setOrderType(updatedOrder);
                    this.Orders.orders[todayStr][res.order_id] = updatedOrder;
                    if (this.isHostTrigger) { 
                        this.isHostTrigger = false; 
                    } else {
                        if (this.date.toDateString() === todayStr && !this.isHostTrigger) {
                            this.isClientTrigger = true;
                            this.changeDate(0, this.date);
                        }
                    }
                } else {
                    
                }
                const toast = this.$mdToast.simple()
                    .textContent('A Customer Jsut Checked-In!')
                    .highlightAction(true)
                    .highlightClass('md-accent')
                    .position('top right');
                this.$mdToast.show(toast);
            
                // console.log(res);
                // Object {order_id: "58351017852e9b0b59ed15cb", customer_id: "58350ff6852e9b0b59ed15c9", checkInAt: "2016-11-29T05:39:36.908Z", checkInNumber: 1}
            });
        }
        scrollToId(id) {
            if(id) {
                this.$location.hash(id);
                this.$anchorScroll();
            } else {
                // this.$location.hash(this.orders[this.i]._id);
                // this.i++;
            }
            
            // this.$state.go('core.orders.list', {'#': this.orders[this.i]._id });
        }
        isHighlited(id) {
            return (this.$stateParams['#'] == id);
        }
        followStateParams() {
            if (this.isClientTrigger) { this.isClientTrigger = false; }
            else {
                if (this.$stateParams.type) {
                    this.showType = this.$stateParams.type;
                } else {
                    this.setType('all');
                }
                if (this.$stateParams['#']) {
                    this.scrollToId(this.$stateParams['#']);
                }
            }
        }
        $onInit() {
            this.calOpen = false;
            this.i = 0;
            console.log(this.$stateParams);
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
                    css: 'md-primary',
                },
                checkInAt: {
                    text: 'checked-in',
                    css: 'md-primary'
                },
                processing: {
                    text: 'processing',
                    css: 'md-accent'
                },
                checkOutAt: {
                    text: 'checked-out',
                    css: 'md-warn',
                }
            };
            this.sortDate = 'scheduleAt';
            this.orderFlags = {
                isCanceled: false,
                notShowup: false,
                checkInAt: null,
                isPaid: false,
                checkOutAt: null
            }
        }
        // interestingArray() {
        //     this.arrtest = [];
        //     this.arrtest['foo'] = 'bar';
        //     this.arrtest.push(1);
        //     this.arrtest.push({zzz:'aaa'});
        //     console.log(this.arrtest);
        //     return this.arrtest;
        // }
        genConfirmDialog(order, text) {
            let name = this.capitalizeStr(order.customers[0].firstname);
            let title = '', ariaLabel = '', textContent = '';
            console.log(name);
            if (text === 'checkout') {
                title = 'Is ' + name + ' Paying by Cash?';
                ariaLabel = 'paid by cash'
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
        // genChooseServiceDialog(order) {
        //     this.chooseService = {
        //         controller: DialogController,
        //         templateUrl: 'tabDialog.tmpl.html',
        //         parent: angular.element(document.body),
        //         // targetEvent: ev,
        //         clickOutsideToClose:true
        //     }
        // }
        // new Date() not allowed in angular html
        
        getToday() { return new Date() }
        changeDate(offset, date) {
            offset = offset || 0;
            date = date || this.date;
            this.date = new Date(date.setDate(date.getDate() + offset));
            this.getOrders(this.date);
        }
        getOrders(date) {
            this.Orders.getCache(date).then((orders)=>{
                this.$timeout(() => {
                    this.orders = [];
                    for (let prop in orders) {
                        this.orders.push(orders[prop]);
                    }
                    // this.orders = orders;
                    console.log('getting' + this.date.toDateString());
                    console.info(this.orders);
                    this.countOrderType();
                    this.followStateParams();
                    // this.scrollToId();
                }, 20);
            });
        }
        _resetOrderCount() {
            angular.forEach(this.typeList, (type)=>{
                type.count = 0;
            });
        }
        countOrderType() {
            this._resetOrderCount();
            angular.forEach(this.orders, (order)=>{
                this.typeList.all.count +=1;
                if (order.type) {
                    this.typeList[order.type].count +=1; 
                }
            });
        }
        setType(key) {
            this.showType = key;
            key === 'all' ? this.showAllTypes = true : this.showAllTypes = false;
            if (key === 'upcoming') {
                this.$timeout(()=>{
                    this.scrollToId('top');
                }, 0);
            }            
        }

        showPreviousOrders(order){
            console.log(order);
            this.PreviousOrdersDialog({
                order_id: order._id,
                pet_id: order.pet_id,
                customer_id: order.customer_id
            }).then((res)=>{

            });
        }

        takeSnapshot(order_id) {
            if (!order_id) {
                return;
            }
            console.log(order_id);
            this.Snapshot().then((res) => {
                const timestamp = new Date().getTime();

                this.Orders.uploadPicture({
                    id: order_id
                }, {
                    order_id: order_id,
                    file: res.blob,
                    filename: order_id + '-' + timestamp + '.png'
                }, (res) => {
                    console.log(res);
                }, (err) => {
                    console.log(err);
                });
            });
        }
        
        chooseService(order){
            let index = this.orders.indexOf(order);
            this.chooseServiceDialog({
                order: order
            }).then((res)=>{
                this.orders.splice(index, 1, this.Orders.getOneCache(order));
                this.countOrderType();
            });
        }

        waivers(order){
            this.ShowSignaturesDialog({
                customer_id: order.customer_id,
                order_id: order._id
            }).then((res)=>{

            });
        }

        edit(order) {
            this.resetOrder(order, ()=>{
                this.$state.go('core.orders.form', {
                    order_id: order._id
                });
            })
            
        }

        inhouseOdrer(order_id, order) {
            let index = this.orders.indexOf(order);
            this.InhouseOrdersDialog({
                order_id: order_id
            }).then((res) => {
                if (!res._id) {
                    console.log('error: '+res)
                } else {
                    this.orders.splice(index, 1, res);
                    this.countOrderType();
                }
            });
        }

        getTotal(order) {
            let total;
            if (!order) { 
                totla = ''; 
            } else {
                if (!order.services) {
                    total = order.total || '';
                } else {
                    total = order.total || order.services.price || '';
                }
            }
            return total;
        }
        
        changeTotal(order) {
            let index = this.orders.indexOf(order);
            let oriMoney = order.total || order.services.price;
            this.$mdDialog.show(
                quickStartDialog({
                element: 'order-list',
                oriMoney: oriMoney,
            }, this.$document[0].getElementById('order-list'))
            ).then((money) => {
                this.Orders.update({
                    id: order._id
                }, { total: money }, (data) => {
                    if (!data._id) {
                        console.log('error: '+data)
                    } else {
                        this.orders.splice(index, 1, data);
                        this.countOrderType();
                    }
                }); 
            }, () => {});
            
        }
        checkout(order) {
            let index = this.orders.indexOf(order);
            let paidByCash;
            this.genConfirmDialog(order, 'checkout');
            this.$mdDialog.show(this.confirm).then(()=>{
                paidByCash = true; 
            }, ()=>{
                paidByCash = false;
            }).then(()=>{
                order.total = order.total || order.services.price
                console.warn(order);
                this.Transactions.checkout({}, {
                    selfService_id: null,
                    order_id: order._id,
                    note: null,
                    customer_id: order.customer_id,
                    total: order.total,
                    paidByCash: paidByCash,
                }, (res)=>{
                    console.log(res);
                    Object.assign(order, {
                        checkOutAt: res.checkOutAt,
                        isPaid: res.isPaid
                    });
                    console.info(order);
                    this.Orders.updateCache(order, ()=>{
                        this.orders.splice(index, 1, order);
                        this.countOrderType();
                    })
                });
            });
        }
       
        update(order) {
            console.log('inside update');
            this.Orders.update({
                id: order._id
            }, order, (data) => {
                
                console.log('updated');
                console.log(data);
                this.refreshOrders();
            });
        }
        
        refreshOrders(){
            this.Orders.getCache().then((orders)=>{
                this.orders = orders;
            });
        }
        checkIn(order) {
            this.isHostTrigger = true;
            let orderDate = new Date(order.scheduleAt);
            let index = this.orders.indexOf(order);
            if (orderDate.toDateString() === new Date().toDateString()) {
                this.resetOrder(order, ()=>{
                    this.Customers.checkIn({
                        phone: order.customers[0].phone
                    }, (res) => {
                        // res
                        // Resource {order_id: "583f16d90171fa7680a83b42", customer_id: "583f169b36080c76668bebd4", 
                        // checkInAt: "2016-11-30T18:41:37.529Z", checkInNumber: 4, $promise: Promise…}
                        let updatedOrder = Object.assign(order, res);
                        this.Orders.updateCache(updatedOrder, ()=>{
                            this.orders.splice(index, 1, updatedOrder);
                            this.countOrderType();
                            // timeout for .ng-hide-add
                            this.$timeout(()=>{
                                this.setType('checkInAt');
                            }, 750)
                            // timeout for .ng-hide-add + .ng-hide-remove
                            this.$timeout(()=>{
                                this.scrollToId(updatedOrder._id);
                            }, 1300)
                            
                        });
                    });
                })
            } else {
                this.genConfirmDialog(order, 'CHECK IN'); 
                this.$mdDialog.show(this.confirm).then(() => {
                    this.Orders.update({
                        id: order._id
                    }, Object.assign(order, this.orderFlags, {scheduleAt: new Date()}), (data)=>{
                        this.Customers.checkIn({
                            phone: order.customers[0].phone
                        }, ()=>{
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
            }, this.orderFlags, (data) => {
                if (!data._id) {
                    console.log('error: '+data)
                } else {
                    this.orders.splice(index, 1, data);
                    this.countOrderType();
                    if (callback) {
                        return callback();
                    }
                }
            });   
        }
         resetCheckOut(order) {
            let index = this.orders.indexOf(order);
            this.Orders.update({
                id: order._id
            }, {
                checkOutAt: null,
                isPaid: false
            }, (data) => {
                if (!data._id) {
                    console.log('error: '+data)
                } else {
                    this.orders.splice(index, 1, data);
                    this.countOrderType();
                    }
                }
            );  
            
            
            this.Transactions.query({
                order_id:order._id
            }, (data) => {
                this.Transactions.delete({
                    id: data[0]._id
                }, (res) => {
                    console.log(res)
                });
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
                        if (!data._id) {
                            console.log('error: '+data)
                        } else {
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
                        if (!data._id) {
                            console.log('error: '+data)
                        } else {
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
        // setDateMode(mode) {
        //     this.dateMode = mode;
        //     if (mode == 'all dates') {
        //         this.viewAll();
        //     } else if (mode == 'today') {
        //         this.viewToday();
        //     } else if (mode == 'range') {
        //         this.viewRange();
        //     }
        // }
        // setSortDate() {
        //     for (let i=0; i<this.orders.length; i++) {
        //         console.log(this.orders[i].scheduleAt);
        //     }
            
        //     this.sortDate = (this.sortDate == 'scheduleAt') ?
        //         '-scheduleAt' : 'scheduleAt';
        // }
        // queryOrdersWithDate(all) {
        //     const method = all ? 'query' : 'getByDate';
        //     const query = all ? {} : this._getDateRange();
        //     this.Orders[method](query, (orders) => {
        //         this.orders = orders;
        //         this.setOrderType();
        //             // console.error(order);
        //         console.warn(this.orders);
        //         // this.getPets();
        //         // this.getCustomers();
        //         // this.$timeout(() => {
        //         //     this.orders = this.orders;
        //         // }, 20);
        //     });
        // }
        // viewAll() {
        //     this.queryOrdersWithDate(true);
        // }
        // viewToday() {
        //     // this.Orders.getCache(this.date).then((orders)=>{
        //     //     this.$timeout(() => {
        //     //         this.orders = this.orders;
        //     //     }, 20);
        //     // })
            
            
        //     // this.Orders.getByDate({}, (orders) => {
        //     //     this.orders = orders;
        //     //     this.getPets();
        //     //     this.getCustomers();
        //     //     this.$timeout(() => {
        //     //         this.orders = this.orders;
        //     //     }, 20);
        //     // });
        // }
        // viewDate() {
        //     // this.dateRange.from = this.dateRange.to;
        //     // this.queryOrdersWithDate();
        //     this.Orders.getByDate({
        //         // date: this.today
        //         date: this.dateRange.to
        //     }, (orders) => {
        //         this.orders = orders;
        //         this.getPets();
        //         this.getCustomers();
        //         this.$timeout(() => {
        //             this.orders = this.orders;
        //         }, 20);
        //     });
        // }
        // viewRange() {
        //     this.queryOrdersWithDate();
        // }
        // isSameHour(thisOrder, lastOrder) {
        //     if (lastOrder) {
        //         const d1 = new Date(thisOrder.scheduleAt);
        //         const d2 = new Date(lastOrder.scheduleAt);
        //         if(d1.getDate() === d2.getDate() 
        //         && d1.getHours() === d2.getHours()) {
        //             return true;
        //         } else { return false; }
        //     } else { return false; }
        // }
        // viewSince(since) {
        //     this.dateRange.to = angular.copy(this.today);
        //     const date = angular.copy(this.today);
        //     this.dateRange.from = date.setDate;
        // }
         // setOrdersList() {
        //     const orders = {
        //         // checkedIn: [],
        //         checkedIn: {
        //             'order_id1': {　 /* resource entity */ },
        //             'order_id2': {}
        //         },
        //         open: {

        //         },
        //         close: {

        //         },
        //         cancelled: {

        //         }
        //     }

        //     orders['checkedIn'][order_id];

        //     orders['cancelled'][order_id] = orders['checkedIn'][order_id];
        //     delete orders['checkedIn'][order_id];
        // }
        
        // getPets() {
        //     angular.forEach(this.orders, (order) => {
        //         if (!this.pets[order.pet_id]) {
        //             this.Pets.get({
        //                 id: order.pet_id
        //             }, (pet) => {
        //                 this.pets[order.pet_id] = pet;
        //                 console.log(this.pets);
        //             });
        //         }
        //     });
        // }

        // getCustomers() {
        //     angular.forEach(this.orders, (order) => {
        //         if (!this.customers[order.customer_id]) {
        //             this.Customers.get({
        //                 id: order.customer_id
        //             }, (customer) => {
        //                 this.customers[order.customer_id] = customer;
        //                 console.log(this.customers);
        //             });
        //         }
        //     });
        // }