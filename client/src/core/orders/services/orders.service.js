/* @ngInject */
class ordersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Orders = $resource('/orders/:id', {
            id: '@id'
        }, {
            getByDate: {
                method: 'GET',
                isArray: true,
                cache: false,
                // params:{
                //     from: 'from',
                //     to: 'to'
                // },
                url: '/ordersByDate'
            }

        });
        return Orders;
    }
}

export default ordersService;
