/* @ngInject */
class selfServicesService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const url = '/selfServices/:customer_id';
        const packagesUrl = '/selfServicesPackages/:customer_id';
        const SelfServices = $resource(url, {
            customer_id: '@customer_id'
        }, {
            printTicket: {
                method: 'GET',
                url: url + '/login',
                params: {
                    'customer_id': '@customer_id'
                }
            },
            check: {
                method: 'GET',
                url: packagesUrl,
                params: {
                    'customer_id': '@customer_id'
                }
            },
            login: {
                method: 'PUT',
                url: packagesUrl + '/login',
                params: {
                    'customer_id': '@customer_id'
                }
            },
            purchasePackage: {
                method: 'PUT',
                url: packagesUrl + '/purchase',
                params: {
                    'customer_id': '@customer_id'
                }
            },
            payBalance: {
                method: 'PUT',
                url: packagesUrl + '/payBalance',
                params: {
                    'customer_id': '@customer_id'
                }
            },
            useCredit: {
                method: 'PUT',
                url: packagesUrl + '/useCredit',
                params: {
                    'customer_id': '@customer_id'
                }
            }
        });
        return SelfServices;
    }
}

export default selfServicesService;
