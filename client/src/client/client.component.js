import template from './client.html';
import './client.styl';

const clientComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ClientController {
        static get $inject() {
            return ['$log', '$timeout', '$state', '$stateParams', 'Client', 'Socket'];
        }
        constructor($log, $timeout, $state, $stateParams, Client, Socket) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Client = Client;
            this.Socket = Socket;

            this.Socket.on('signaturesInit', (res) => {
                console.log(res);
                this.$state.go('client.signature', {
                    waiverName: res.waiverName
                });
            });
        }
        $onInit() {
            // this.$state.go('client.customersCheckIn');
            this.$state.go('client.signature');
        }
    }
};
export default clientComponent;
