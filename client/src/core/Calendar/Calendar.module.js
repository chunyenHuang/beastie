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
                    <calendar select-event="true" layout="column" flex></calendar>
                `
            });
    })
    .name;

export default calendarModule;
