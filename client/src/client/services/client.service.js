/* @ngInject */
class clientService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Client = $resource('/client/:id', {id:'@id'});
        return Client;
    }
}

export default clientService;
