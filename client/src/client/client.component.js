import template from './client.html';
import './client.styl';

const clientComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ClientController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', '$document',
                'Client', 'Socket', 'Fullscreen', 'Settings', 'UserAuth'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, $document,
            Client, Socket, Fullscreen, Settings, UserAuth
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$document = $document;
            this.Client = Client;
            this.Socket = Socket;
            this.Fullscreen = Fullscreen;
            this.fullscreenIcon = 'fullscreen';
            this.UserAuth = UserAuth;
            this.Settings = Settings;

            this.Socket.on('signaturesInit', (res) => {
                this.$state.go('client.signature', {
                    customer_id: res.customer_id,
                    order_id: res.order_id,
                    name: res.name
                });
            });
        }
        toggleFullscreen() {
            if (this.Fullscreen.isEnabled()) {
                this.fullscreenIcon = 'fullscreen';
                this.Fullscreen.cancel();
            } else {
                this.Fullscreen.all();
                this.fullscreenIcon = 'fullscreen-exit';
                this.showFullScreenButton = false;
            }
        }

        $onInit() {
            this.checkUser();
        }

        checkUser() {
            this.UserAuth
                .get({}).$promise
                .then((res) => {
                    if (
                        res.role == 'deviceClient'
                    ) {
                        this.$state.go('client.customersCheckIn');
                        this.Settings.query({
                            type: 'company'
                        }).$promise.then((res) => {
                            this.title = res[0].name;
                            this.titleZh = res[0].zhName;
                        });
                    } else {
                        this.$state.go('userAuth');
                    }
                }, () => {
                    this.$state.go('userAuth');
                });
        }
    }
};
export default clientComponent;