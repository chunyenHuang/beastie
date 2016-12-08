/* @ngInject */
class creditsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const url = '/credits/:customer_id';
        const Credits = $resource(url, {
            customer_id: '@customer_id'
        }, {
            // getCredits: {
            //     method: 'GET',
            //     url: url,
            //     params: {
            //         customer_id: '@customer_id'
            //     },
            //     isArray: false
            // },
            login: {
                method: 'POST',
                url: url + '/login',
                params: {
                    customer_id: '@customer_id'
                }
            },
            purchase: {
                method: 'POST',
                url: url + '/purchase',
                params: {
                    customer_id: '@customer_id'
                }
            },
            use: {
                method: 'POST',
                url: url + '/use',
                params: {
                    customer_id: '@customer_id'
                }
            }
        });
        return Credits;
    }
}

export default creditsService;
