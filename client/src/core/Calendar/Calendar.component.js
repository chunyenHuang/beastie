import template from './Calendar.html';
import './Calendar.styl';

const calendarComponent = {
    template,
    bindings: {
        defaultView: '@',
        gotoDate: '<',
        hideTitle: '<',
        selectDate: '<',
        selectEvent: '<',
        onUpdate: '&'
    },
    controller: /* @ngInject */ class CalendarController {
        static get $inject() {
            return [
                '$log',
                '$state',
                '$stateParams',
                '$document',
                '$timeout',
                '$mdMenu',
                'Orders'
            ];
        }
        constructor(
            $log,
            $state,
            $stateParams,
            $document,
            $timeout,
            $mdMenu,
            Orders
        ) {
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$document = $document;
            this.$timeout = $timeout;
            this.$mdMenu = $mdMenu;
            this.Orders = Orders;
            this.$ = $;
        }

        $onInit() {}

        $onChanges() {
            if (this.orders) {
                this.goTo();
                return;
            }
            this.Orders.query({}).$promise.then((orders) => {
                this.orders = orders;
                this.initCalendar(orders);
            });
        }

        goTo() {
            if (this.gotoDate) {
                this.Calendar.fullCalendar('gotoDate', new Date(this.gotoDate));
                this.Calendar.fullCalendar('render');
            }
        }

        initCalendar(orders) {
            this.Calendar = this.$(this.$document[0].getElementById('beastie-calendar'));
            this.Calendar.fullCalendar('render');

            this.$timeout(() => {
                this.Calendar.fullCalendar({
                    header: {
                        left: 'prev,next today myCustomButton',
                        center: ((!this.hideTitle) ? 'title' : ''),
                        right: 'month,agendaWeek,agendaDay'
                    },
                    defaultView: this.defaultView || 'agendaWeek',
                    navLinks: true,
                    contentHeight: 'auto',
                    timeFormat: 'H:mm',
                    scrollTime: '10:00:00',
                    minTime: '10:00:00',
                    maxTime: '21:00:00',
                    selectable: true,
                    titleFormat: 'MMM D YYYY',
                    // unselectAuto: true,
                    dayClick: (function (ctrl) {
                        if (!ctrl.selectDate) {
                            return;
                        }
                        return function (date) {
                            ctrl.onUpdate({
                                date
                            });
                            if (ctrl.lastClickedDay) {
                                ctrl.lastClickedDay.toggleClass('selected-date');
                            }
                            ctrl.lastClickedDay = $(this);
                            ctrl.lastClickedDay.toggleClass('selected-date');
                        };
                    })(this),
                    // slotEventOverlap: false,
                    eventLimit: 1,
                    eventClick: (function (ctrl) {
                        if (!ctrl.selectEvent) {
                            return;
                        }
                        let lastClicked;
                        return function (event) {
                            const order = ctrl.findOrder(event.id);
                            ctrl.selected = order;
                            if (lastClicked) {
                                lastClicked.toggleClass('selected');
                            }
                            lastClicked = $(this);
                            lastClicked.toggleClass('selected');
                        };
                    })(this),
                    eventMouseover: function () {
                        console.log(this);
                        $(this).toggleClass('selected-hover');
                    },
                    eventMouseout: function () {
                        console.log(this);
                        $(this).toggleClass('selected-hover');
                    },
                    businessHours: [
                        {
                            dow: [0, 1, 3, 4, 5, 6], // Monday==1
                            start: '10:00',
                            end: '21:00'
                        }
                    ],
                    dayRender: (function (ctrl) {
                        return function (date, cell) {
                            if(!ctrl.gotoDate){
                                return;
                            }
                            if (
                                new Date(ctrl.gotoDate).toISOString().split('T')[0] ===
                                date.format()
                            ) {
                                ctrl.lastClickedDay = $(cell);
                                ctrl.lastClickedDay.toggleClass('selected-date');
                            }
                        };
                    })(this),
                    eventSources: this.getEvents(orders)
                });
                this.goTo();
                this.Calendar.fullCalendar('render');
            });
        }

        getEvents(orders) {
            const events = [];
            angular.forEach(orders, (order) => {
                events.push(this.parseEvent(order));
            });
            return events;
        }

        parseEvent(order) {
            return {
                events: [
                    {
                        id: order._id,
                        title: this.getCustomerInfo(order.customers[0]),
                        start: new Date(order.scheduleAt)
                    }
                ],
                // color: '#258a82'
                backgroundColor: '#f9f9f9',
                borderColor: this.getRandomColor(),
                textColor: 'black'
            };
        }

        getCustomerInfo(customer) {
            if (!customer) {
                return 'no info';
            }
            const fullname = customer.firstName + customer.lastName;
            const phone = customer.phone;
            return `${fullname} \n (${phone[0]}${phone[1]}${phone[2]})${phone[3]}${phone[4]}${phone[5]}-${phone[6]}${phone[7]}${phone[8]}${phone[9]}`;
        }

        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        findOrder(order_id) {
            const order = this.orders.find((element) => {
                return element._id === order_id;
            });
            return order;
        }

        addNewOrder(event, mdOpenMenu) {
            console.log(event);
            // this.$mdMenu.hide();
            this.$timeout(() => {
                mdOpenMenu(event);
            }, 300);
        }

        editOrder() {
            console.log(this.selected);
            this.$state.go('core.orders.form', {
                order_id: this.selected._id
            });
        }
    }
};
export default calendarComponent;
