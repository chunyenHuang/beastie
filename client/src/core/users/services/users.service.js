class usersService {
    static get $inject() {
        return ['$resource', '$cacheFactory'];
    }
    constructor($resource, $cacheFactory) {
        'ngInject';
        const Users = $resource('/users/:id', {id:'@id'});
        // Users.$cacheFactory = $cacheFactory;
        return Users;
    }
}

export default usersService;
