/* @ngInject */
class userAuthService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const UserAuth = $resource('/userAuth/:id', {id:'@id'});
        return UserAuth;
    }
}

export default userAuthService;
