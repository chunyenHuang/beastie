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
                checkInAt: {
                    text: 'checked in',
                    show: true,
                    css: 'md-primary'
                },
                isCanceled: {
                    text: 'canceled',
                    show: true,
                    css: 'md-accent'
                },
                notShowup: {
                    text: 'no-show',
                    show: true,
                    css: 'md-warn'
                },
                upcoming: {
                    text: 'upcoming',
                    show: true,
                    css: 'md-primary'
                }
            };
            this.sortDate = 'scheduleAt';
            this.showAllTypes = true;
            this.setDateMode('date');
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

        setType(type) {
            type.show = !type.show;
            console.log(this.typeList);
        }
        toggleAllType() {
            this.showAllTypes = !this.showAllTypes;
            for (let prop in this.typeList) {
                this.typeList[prop].show = this.showAllTypes;
            }
        }
        decideShow(order) {
            for (let prop in this.typeList) {
                if (this.typeList[prop].show) {
                    if (order[prop]) {
                        return true;
                    }
                }
            }
            if (this.typeList.upcoming.show) {
                return !(order.checkInAt || order.isCanceled || order.notShowup);
            }
            return false;
        }
        setDateMode(mode) {
            this.dateMode = mode;
            if (mode == 'all dates') {
                this.viewAll();
            } else if (mode == 'date') {
                this.viewDate();
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
                this.getPets();
                this.getCustomers();
                this.$timeout(() => {
                    this.orders = this.orders;
                }, 20);
            });
        }
        viewAll() {
            this.queryOrdersWithDate(true);
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
            this.Orders.update({
                id: order._id
            }, order, () => {
                console.log('updated');
            });
        }
    }
};
export default ordersListComponent;
