/* @ngInject */
class albumsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Albums = $resource('/albums/:id', {id:'@id'});
        return Albums;
    }
}

export default albumsService;
