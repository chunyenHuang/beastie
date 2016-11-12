import template from './signature.html';
import './signature.styl';

const signatureComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SignatureController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Signature', 'Socket'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Signature, Socket
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Signature = Signature;
            this.Socket = Socket;
        }
    }
};
export default signatureComponent;
