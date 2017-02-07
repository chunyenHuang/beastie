import calendarService from './Calendar.service';

const calendarModule = angular
    .module('beastie.core.calendar.services', [])
    .service('CalendarService', calendarService)
    .name;

export default calendarModule;
