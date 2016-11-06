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
            this.Users.query({}, (users) => {
                this.users = users;
            });
        }
    }
};
export default usersComponent;
