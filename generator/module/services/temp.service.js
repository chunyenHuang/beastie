/* @ngInject */
class <%= name %>Service {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const <%= upCaseName %> = $resource('/<%= name %>/:id', {id:'@id'});
        return <%= upCaseName %>;
    }
}

export default <%= name %>Service;
