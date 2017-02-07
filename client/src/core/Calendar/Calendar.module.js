import calendarComponent from './Calendar.component';
import calendarServiceModule from './services';

const calendarModule = angular
    .module('beastie.core.calendar', [
        calendarServiceModule
    ])
    .component('calendar', calendarComponent)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.calendar', {
                url: '/calendar',
                template: `
                    <calendar layout="column" flex></calendar>
                `
            });
    })
    .name;

export default calendarModule;
