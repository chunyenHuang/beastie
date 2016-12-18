import template from './client.html';
import './client.styl';

const clientComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ClientController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Client', 'Socket', 'Fullscreen', 'Settings'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Client, Socket, Fullscreen, Settings
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Client = Client;
            this.Socket = Socket;
            this.Fullscreen = Fullscreen;
            Settings.query({
                type: 'company'
            }).$promise.then((res) => {
                this.title = res[0].name;
                this.titleZh = res[0].zhName;
            });
            this.fullscreenIcon = 'fullscreen';

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
            this.$state.go('client.customersCheckIn');
            // this.$state.go('client.signature');
        }
    }
};
export default clientComponent;
