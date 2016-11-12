/* @ngInject */
class signatureService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Signature = $resource('/signature/:id', {id:'@id'});
        return Signature;
    }
}

export default signatureService;
