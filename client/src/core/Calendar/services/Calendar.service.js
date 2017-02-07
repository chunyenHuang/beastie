/* @ngInject */
class CalendarService {
    static get $inject() {
        return ['$resource', '$cacheFactory', 'apiConstants'];
    }
    constructor($resource, $cacheFactory, apiConstants) {
        const url = apiConstants.resourceApi + 'calendar/:id';
        let service = $resource(url, {
            id: '@id'
        }, {});
        service.$cacheFactory = $cacheFactory;
        for (let prop in service) {
            this[prop] = service[prop];
        }
    }
    getTemplate(){
        return {

        };
    }
}

export default CalendarService;
