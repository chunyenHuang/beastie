import template from './userAuthLogout.html';
import './userAuthLogout.styl';

const userAuthLogoutComponent = {
    template,
    bindings: {
        style: '@'
    },
    controller: /* @ngInject */ class UserAuthLogoutController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'UserAuth'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, UserAuth
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.UserAuth = UserAuth;
        }
        $onInit() {
            this.checkLogged();
            console.log(this.style);
        }

        checkLogged(){
            this.UserAuth.get({}, (res) => {
                if (res.statusCode != 401) {
                    this.isLogged = true;
                }
            });
        }

        logout() {
            this.UserAuth.delete({}, () => {
                this.$state.go('userAuth');
            });
        }
    }
};
export default userAuthLogoutComponent;
