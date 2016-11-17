/* @ngInject */
class printerService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Printer = $resource('/printer', {
        },{
            test: {
                method: 'GET',
                url: '/printer/test'
            }
        });
        return Printer;
    }
}

export default printerService;
