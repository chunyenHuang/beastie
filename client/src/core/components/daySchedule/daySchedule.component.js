import template from './daySchedule.html';
import './daySchedule.styl';

const dayScheduleComponent = {
    template,
    bindings: {
        newOrder: '<',
        orders: '<',
        expand: '@'
    },
    controller: /* @ngInject */ class DayScheduleController {
        static get $inject() {
            return [
                '$log', '$timeout', '$document', '$stateParams', 'Settings'
            ];
        }
        constructor(
            $log, $timeout, $document, $stateParams, Settings
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$document = $document;
            this.$stateParams = $stateParams;
            this.Settings = Settings;
        }

        $onInit() {
            this.colors = [];
            for (var i = 0; i < 40; i++) {
                this.colors.push(this.getRandomColor());
            }
            this.Settings.query({
                type: 'officeHours'
            }, (res) => {
                this.officeHours = res[0].officeHours;
                this.setDaySchedule();
            });
            this.Settings.query({
                type: 'officeHours'
            }, (res) => {
                this.maxHours = res[0].maxHours;
                this.officeHours = res[0].officeHours;
                this.setDaySchedule();
            });
        }

        $onChanges() {
            if(this.orders){
                this.reloadSchedule();
                this.calculateHours();
            }
        }

        calculateHours() {
            this.totalHours = 0;
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].services && this.orders[i].services.estimatedHours) {
                    this.totalHours += this.orders[i].services.estimatedHours;
                } else {
                    this.totalHours += 2;
                }
            }
        }

        reloadSchedule() {
            if (!this.orders || !angular.isArray(this.orders) || this.orders.length === 0) {
                this.removeEvents();
                return;
            }
            this.height = (this.height) ? parseInt(this.height) : 0;
            this.grid = {
                x: 50,
                y: 10 + this.height,
                length: 200 - 1,
                height: this.height + 10 - 1
            };
            let fieldHeight = 30 + (this.grid.height + 1) * this.orders.length;
            fieldHeight = (fieldHeight < 100) ? 100 : fieldHeight;
            const scheduleField = this.$document[0].getElementById('day-schedule');
            scheduleField.setAttribute('style', 'height:' + fieldHeight + 'px;');

            this.appended = 0;
            this.parent = this.$document[0].getElementById('day-schedule-events');
            this.removeEvents();
            this.sortByScheduleAt();
            this.setEvents();
        }

        toggleExpand() {
            if (this.height) {
                this.expand = false;
                this.height = 0;
            } else {
                this.expand = true;
                this.height = 50;
            }
            this.reloadSchedule();
        }

        sortByScheduleAt() {
            this.orders.sort((a, b) => {
                return new Date(a.scheduleAt) - new Date(b.scheduleAt);
            });
        }

        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        setEvents() {
            for (var i = 0; i < this.orders.length; i++) {
                this.appendOrderEvent(this.orders[i], this.colors[i]);
            }
        }

        getPosition(scheduleAt) {
            scheduleAt = new Date(scheduleAt);
            // console.log(scheduleAt.getHours(), scheduleAt.getMinutes());
            let startAt = scheduleAt.getHours() - this.officeHours['Monday'].from;
            startAt = (startAt < 0) ? 0 : startAt;
            const left = startAt * this.grid.x * 2 + scheduleAt.getMinutes() / 30 * this.grid.x;
            const top = this.appended * this.grid.y;
            this.appended++;
            // console.log(top, left);
            return {
                top: top,
                left: left
            };
        }

        appendOrderEvent(order, color) {
            const position = this.getPosition(order.scheduleAt);
            let length = this.grid.length;
            if (order.services) {
                length = this.grid.x * order.services.estimatedHours * 2 - 1;
            }
            const style = 'background-color:' + color + ';' +
                'top:' + position.top + 'px;' +
                'left:' + position.left + 'px;' +
                'width:' + length + 'px;' +
                'height:' + this.grid.height + 'px;';
            const eventDiv = this.$document[0].createElement('div');
            eventDiv.classList.add('day-schedule-event');
            eventDiv.setAttribute('id', order._id);
            eventDiv.setAttribute('style', style);
            this.parent.appendChild(eventDiv);
        }

        removeEvents() {
            const elements = this.$document[0].getElementsByClassName('day-schedule-event');
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        }

        isInt(num) {
            return (num % 1) === 0;
        }

        setDaySchedule() {
            this.dayTimes = [];
            for (var i = this.officeHours['Monday'].from; i <= this.officeHours['Monday'].to; i += 0.5) {
                this.dayTimes.push(i);
            }
        }
    }
};
export default dayScheduleComponent;
