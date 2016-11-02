/* @ngInject */
class customersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Customers = $resource('/customers/:id', {id:'@id'});
        return Customers;
    }
}

export default customersService;
