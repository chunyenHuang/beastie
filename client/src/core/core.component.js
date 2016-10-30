import './core.styl';
import template from './core.html';

const coreComponent = {
    template,
    controller: /* @ngInject */ class CoreController {
        static get $inject() {
            return ['$timeout', '$state', 'METADATA'];
        }
        constructor($timeout, $state, METADATA) {
            this.$timeout = $timeout;
            this.$state = $state
            this.METADATA = METADATA;
        }
        $onInit() {
            this.message = 'Hello~';
            this.$timeout(() => {
                this.message += 'World';
            }, 1500);
        }
        goToClient() {
            this.$state.go('client');
        }
    }
};

export default coreComponent;
