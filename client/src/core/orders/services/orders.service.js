/* @ngInject */
class ordersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Orders = $resource('/orders/:id', {id:'@id'});
        return Orders;
    }
}

export default ordersService;
