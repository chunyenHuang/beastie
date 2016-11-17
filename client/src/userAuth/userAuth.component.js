import template from './userAuth.html';
import './userAuth.styl';

const userAuthComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class UserAuthController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'UserAuth'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            UserAuth
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.UserAuth = UserAuth;
        }

        $onInit() {
            this.UserAuth.get({}, (res) => {
                if(res.statusCode != 401){
                    this.goStateByRole(res.role);
                }
            });
        }

        login() {
            this.UserAuth.save(this.user, (res) => {
                if(res.role){
                    this.goStateByRole(res.role);
                }
            });
        }

        goStateByRole(role) {
            switch (role) {
                case 'admin':
                    console.log('core.orders.list');
                    this.$state.go('core.orders.list');
                    break;
                case 'deviceClient':
                    this.$state.go('client');
                    break;
                default:
            }
        }
    }
};
export default userAuthComponent;
