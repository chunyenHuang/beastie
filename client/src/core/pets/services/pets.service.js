/* @ngInject */
class petsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Pets = $resource('/pets/:id', {id:'@id'});
        return Pets;
    }
}

export default petsService;
