import template from './users.html';
import './users.styl';

const usersComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class UsersController {
        static get $inject() {
            return ['$log', '$timeout', 'Users'];
        }
        constructor($log, $timeout, Users) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.Users = Users;
        }
        $onInit() {
            this.resourceTest();
        }
        resourceTest(){
            // https://docs.angularjs.org/api/ngResource/service/$resource
            this.Users.query({
                name: 'Lilian'
            }, (users) => {
                console.log(users);
            });
            this.Users.query({}, (users) => {
                console.warn(users);
            });
            this.Users.get({
                id: '58163fb66ac4b6a263816f92'
            }, (user) => {
                console.info(user);
                user.name = 'ChangedName';
                // user.$update();
            });
        }
    }
};
export default usersComponent;
