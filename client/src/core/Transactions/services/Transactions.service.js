/* @ngInject */
class transactionsService {
    static get $inject() {
        return ['$resource', 'SharedUtil'];
    }
    constructor($resource, SharedUtil) {
        this.SharedUtil = SharedUtil;

        const Transactions = $resource('/transactions/:id', {
            id: '@id'
        }, {
            checkout: {
                method: 'POST',
                url: '/transactions'
            },
            void: {
                method: 'PUT',
                url: '/transactions/:id/void',
                parmas: {
                    id: '@id'
                }
            },
            // update: {
            //     method: 'PUT',
            //     url: '/transactions/:id/update',
            //     parmas: {
            //         id: '@id'
            //     }
            // },
            delete: {
                method: 'DELETE',
                url: '/transactions/:id',
                parmas: {
                    id: '@id'
                }
            }
        });

        for (let prop in Transactions) {
            this[prop] = Transactions[prop];
        }
    }
}

export default transactionsService;
