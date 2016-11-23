import template from './ordersList.html';
import './ordersList.styl';

const ordersListComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class OrdersListController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Orders', 'Pets', 'SharedUtil', 'Customers', '$mdColors',
                'Snapshot', 'InhouseOrdersDialog', 'ShowSignaturesDialog',
                'PreviousOrdersDialog'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Orders, Pets, SharedUtil, Customers, $mdColors,
            Snapshot, InhouseOrdersDialog, ShowSignaturesDialog,
            PreviousOrdersDialog
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Orders = Orders;
            this.Pets = Pets;
            this.getDayName = SharedUtil.getDayName;
            this.Customers = Customers;
            this.$mdColors = $mdColors;
            this.Snapshot = Snapshot;
            this.InhouseOrdersDialog = InhouseOrdersDialog;
            this.ShowSignaturesDialog = ShowSignaturesDialog;
            this.PreviousOrdersDialog = PreviousOrdersDialog;

            this.pets = {};
            this.customers = {};
            this.today = new Date();

        }

        $onInit() {
            this.dateRange = {
                from: angular.copy(this.today),
                to: angular.copy(this.today)
            };
            this.queryOrdersWithDate(true);

            this.dateModeList = ['all dates', 'today'];
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
                // isCanceled: {
                //     text: 'canceled',
                //     show: true,
                //     css: 'md-accent'
                // },
                // notShowup: {
                //     text: 'no-show',
                //     show: true,
                //     css: 'md-warn'
                // },
                
            };
            this.sortDate = 'scheduleAt';
            this.showAllTypes = true;
            this.showType = "all";
            this.setDateMode('date');
        }
        setOrderType() {
            this._resetOrderCount();
            angular.forEach(this.orders, (order)=>{
                this.typeList.all.count +=1;
                if (order.checkInAt) {
                    if (order.checkOutAt) { 
                        order.type = 'checkOutAt'; 
                        this.typeList.checkOutAt.count +=1;
                    } 
                    else if (order.inhouseOrders.length) { 
                        order.type = 'processing';
                        this.typeList.processing.count +=1;
                    }
                    else { 
                        order.type = 'checkInAt';
                        this.typeList.checkInAt.count +=1;
                    }
                } else {
                    if (!order.isCanceled && !order.notShowup) { 
                        order.type = 'upcoming';
                        this.typeList.upcoming.count +=1;                    
                    }
                    else { order.type = null; }
                }
            });
        }
        _resetOrderCount() {
            angular.forEach(this.typeList, (type)=>{
                type.count = 0;
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

        waivers(order){
            this.ShowSignaturesDialog({
                customer_id: order.customer_id,
                order_id: order._id
            }).then((res)=>{

            });
        }

        
        
        
        setDateMode(mode) {
            this.dateMode = mode;
            if (mode == 'all dates') {
                this.viewAll();
            } else if (mode == 'today') {
                this.viewToday();
            } else if (mode == 'range') {
                this.viewRange();
            }
            const checkedin = document.getElementById('order-list').querySelectorAll('md-grid-list.label-checkedin');
            console.log(checkedin);
            // this.$mdColors.applyThemeColors('#order-list', {color: 'red-A200-0.3'});
        }
        _getDateRange() {
            const dateRangeCopy = angular.copy(this.dateRange);
            return {
                from: new Date(dateRangeCopy.from.setHours(0, 0, 0, 0)),
                to: new Date(dateRangeCopy.to.setHours(23, 59, 59, 99))
            };
        }
        setSortDate() {
            for (let i=0; i<this.orders.length; i++) {
                console.log(this.orders[i].scheduleAt);
            }
            
            this.sortDate = (this.sortDate == 'scheduleAt') ?
                '-scheduleAt' : 'scheduleAt';
        }
        queryOrdersWithDate(all) {
            const method = all ? 'query' : 'getByDate';
            const query = all ? {} : this._getDateRange();
            this.Orders[method](query, (orders) => {
                this.orders = orders;
                this.setOrderType();
                    // console.error(order);
                console.info(this.orders);
                // this.getPets();
                // this.getCustomers();
                // this.$timeout(() => {
                //     this.orders = this.orders;
                // }, 20);
            });
        }
        viewAll() {
            this.queryOrdersWithDate(true);
        }
        viewToday() {
            this.Orders.getByDate({}, (orders) => {
                this.orders = orders;
                this.getPets();
                this.getCustomers();
                this.$timeout(() => {
                    this.orders = this.orders;
                }, 20);
            });
        }
        viewDate() {
            // this.dateRange.from = this.dateRange.to;
            // this.queryOrdersWithDate();
            this.Orders.getByDate({
                // date: this.today
                date: this.dateRange.to
            }, (orders) => {
                this.orders = orders;
                this.getPets();
                this.getCustomers();
                this.$timeout(() => {
                    this.orders = this.orders;
                }, 20);
            });
        }
        viewRange() {
            this.queryOrdersWithDate();
        }
        isToday(date) {
            if (this.today.toLocaleDateString()
            === new Date(date).toLocaleDateString()) {
                return true;
            } else { return false; }
        }
        isSameHour(thisOrder, lastOrder) {
            if (lastOrder) {
                const d1 = new Date(thisOrder.scheduleAt);
                const d2 = new Date(lastOrder.scheduleAt);
                if(d1.getDate() === d2.getDate() 
                && d1.getHours() === d2.getHours()) {
                    return true;
                } else { return false; }
            } else { return false; }
        }
        hourIndex(thisOrder, lastOrder){
            return '';
            // var counter = 0;
            // if (lastOrder) {
            //     if(this.isSameHour(thisOrder, lastOrder)) {
            //         counter +=1; 
            //         return counter;
            //     } else { 
            //         counter = 1;
            //         return counter;
            //     }
            // }
            
            // else { 
            //     counter = 1;
            //     return counter;
            // }
        }
        // viewSince(since) {
        //     this.dateRange.to = angular.copy(this.today);
        //     const date = angular.copy(this.today);
        //     this.dateRange.from = date.setDate;
        // }
        getPets() {
            angular.forEach(this.orders, (order) => {
                if (!this.pets[order.pet_id]) {
                    this.Pets.get({
                        id: order.pet_id
                    }, (pet) => {
                        this.pets[order.pet_id] = pet;
                        console.log(this.pets);
                    });
                }
            });
        }

        getCustomers() {
            angular.forEach(this.orders, (order) => {
                if (!this.customers[order.customer_id]) {
                    this.Customers.get({
                        id: order.customer_id
                    }, (customer) => {
                        this.customers[order.customer_id] = customer;
                        console.log(this.customers);
                    });
                }
            });
        }

        setOrdersList() {
            const orders = {
                // checkedIn: [],
                checkedIn: {
                    'order_id1': {　 /* resource entity */ },
                    'order_id2': {}
                },
                open: {

                },
                close: {

                },
                cancelled: {

                }
            }

            orders['checkedIn'][order_id];

            orders['cancelled'][order_id] = orders['checkedIn'][order_id];
            delete orders['checkedIn'][order_id];
        }

        edit(order_id) {
            this.$state.go('core.orders.form', {
                order_id: order_id
            });
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

        checkIn(order) {
            order.checkInAt = new Date();
            order.notShowup = false;
            order.isCanceled = false;
            this.update(order);
        }
        cancel(order) {
            order.checkInAt = null;
            order.notShowup = false;
            order.isCanceled = true;
            order.checkOutAt = null;
            order.isPaid = false;
            this.update(order);
        }
        notShowup(order) {
            order.checkInAt = null;
            order.notShowup = true;
            order.isCanceled = false;
            order.checkOutAt = null;
            order.isPaid = false;
            this.update(order);
        }
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
            }, order, () => {
                console.log('updated');
            });
        }
    }
};
export default ordersListComponent;
