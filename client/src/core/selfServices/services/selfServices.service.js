/* @ngInject */
class selfServicesService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const url = '/selfServices/:id';
        const SelfServices = $resource(url, {
            id: '@id'
        }, {
            purchase: {
                method: 'POST',
                url: '/selfServices'
            }
        });
        return SelfServices;
    }
}

export default selfServicesService;
