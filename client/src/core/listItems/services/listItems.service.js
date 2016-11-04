/* @ngInject */
class listItemsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const ListItems = $resource('/listItems/:id', {id:'@id'});
        return ListItems;
    }
}

export default listItemsService;
