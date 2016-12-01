import template from './ordersList.html';
import './ordersList.styl';

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
                'chooseServiceDialog', '$location', '$anchorScroll'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders, Pets, SharedUtil, Customers, $mdColors,
            Snapshot, InhouseOrdersDialog, ShowSignaturesDialog,
            PreviousOrdersDialog, Socket, $mdDialog, $mdToast, 
            chooseServiceDialog, $location, $anchorScroll
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
            
            Socket.on('customerCheckIn', (res) => {
                console.log(res);
                if (this.Orders.orders
                    && this.Orders.orders[this.today.toDateString()]
                    && this.Orders.orders[this.today.toDateString()][res.order_id]) {
                    let updatedOrder = Object.assign({}, 
                        this.Orders.orders[this.today.toDateString()][res.order_id],
                        {checkInAt: res.checkInAt, checkInNumber: res.checkInNumber});
                    this.Orders._setOrderType(updatedOrder);
                    this.Orders.orders[this.today.toDateString()][res.order_id] = updatedOrder;
                    if (new Date(res.checkInAt).toDateString() === this.date.toDateString()) {
                        this.getOrders(new Date(res.checkInAt));
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
        scroll() {
        //     this.$location.hash(this.orders[this.i]._id);
        //   // call $anchorScroll()
        //     this.$anchorScroll();
            this.i++;
            this.$state.go('core.orders.list', {'#': this.orders[this.i]._id });
        }
        isHighlited(id) {
            return (this.$stateParams['#'] == id);
        }
        $onInit() {
            this.i = 0;
            console.log(this.$stateParams);
            if(this.$stateParams.type){
                this.showType = this.$stateParams.type;
                // scroll
            } else {
                this.setType('all');
            }
           
            this.today = new Date();
            this.date = new Date();
            this.changeDate(0);
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
        genConfirmDialog(order, text) {
            let name = this.capitalizeStr(order.customers[0].firstname);
            console.log(name);
            this.confirm = this.$mdDialog.confirm()
                .title('Are you setting ' + name +
                    "'s order to " + text + '?')
                .ariaLabel('confirm ' + text)
                .ok('YES')
                .cancel('NO');
        }
        genChooseServiceDialog(order) {
            this.chooseService = {
                controller: DialogController,
                templateUrl: 'tabDialog.tmpl.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose:true
            }
        }
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

        inhouseOdrer(order_id) {
            this.InhouseOrdersDialog({
                order_id: order_id
            }).then((res) => {
                console.log(res);
            });
            // this.$state.go('core.inhouseOrders', {
            // });
        }
        

        
        // cancel(order) {
        //     order.checkInAt = null;
        //     order.notShowup = false;
        //     order.isCanceled = true;
        //     order.checkOutAt = null;
        //     order.isPaid = false;
        //     this.update(order);
        // }
        // notShowup(order) {
        //     order.checkInAt = null;
        //     order.notShowup = true;
        //     order.isCanceled = false;
        //     order.checkOutAt = null;
        //     order.isPaid = false;
        //     this.update(order);
        // }
        checkout(order) {
            order.notShowup = false;
            order.isCanceled = false;
            order.checkOutAt = new Date();
            order.isPaid = true;
            this.update(order);
        }
        resetCheckOut(order) {
            order.checkOutAt = null;
            order.isPaid = false;
            this.update(order);
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
                            this.date = new Date();
                            this.getOrders(this.date);
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