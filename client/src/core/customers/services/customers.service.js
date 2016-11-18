/* @ngInject */
class customersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Customers = $resource('/customers/:id', {
            id: '@id'
        }, {
            getWithPets: {
                method: 'GET',
                url: '/customers/:id/pets',
                params: {
                    id: '@id'
                }
            },
            checkIn: {
                method: 'GET',
                url: '/customerCheckIn/:phone',
                params: {
                    phone: '@phone'
                }
            }
        });
        return Customers;
    }
}

export default customersService;
