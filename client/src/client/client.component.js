import template from './client.html';
import './client.styl';

const clientComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ClientController {
        static get $inject() {
            return ['$log', '$timeout', 'Client'];
        }
        constructor($log, $timeout, Client) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.Client = Client;
        }
    }
};
export default clientComponent;
