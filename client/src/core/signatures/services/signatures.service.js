/* @ngInject */
class signaturesService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Signatures = $resource('/signatures/:id', {
            id: '@id'
        }, {
            init: {
                method: 'POST',
                url: '/signaturesInit',
                transformSend: (data) => {
                    return angular.toJson(data);
                }
            }
        });
        return Signatures;
    }
}

export default signaturesService;
