import template from './users.html';
import './users.styl';

const usersComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class UsersController {
        static get $inject() {
            return ['$log', '$timeout', 'Users', 'Settings'];
        }
        constructor($log, $timeout, Users, Settings) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.Users = Users;
            this.Settings = Settings;
        }

        $onInit() {
            this.Settings.query({
                type: 'roles'
            }, (roles) => {
                this.roles = roles[0].items;
                console.log(this.roles);
            });
            this.Users.query({}, (users) => {
                this.users = users;
            });
        }

        addUser() {
            if (!this.users[0].name || !this.users[0].role) {
                return;
            }
            this.getTemplate((template) => {
                console.log(template);
                this.users.unshift(template);
            })
        }

        getTemplate(callback) {
            this.Users.get({
                id: 'template'
            }, callback);
        }

    }
};
export default usersComponent;
