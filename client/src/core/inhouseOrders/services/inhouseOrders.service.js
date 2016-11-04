/* @ngInject */
class inhouseOrdersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const InhouseOrders = $resource('/inhouseOrders/:id', {id:'@id'});
        return InhouseOrders;
    }
}

export default inhouseOrdersService;
