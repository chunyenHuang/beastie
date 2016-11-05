import './core.styl';
import template from './core.html';

const coreComponent = {
    template,
    controller: /* @ngInject */ class CoreController {
        static get $inject() {
            return ['$timeout', '$state', '$translate', 'METADATA'];
        }
        constructor($timeout, $state, $translate, METADATA) {
            this.$timeout = $timeout;
            this.$state = $state;
            this.$translate = $translate;
            this.METADATA = METADATA;
        }
        $onInit() {
            this.message = 'Hello~';
            this.$timeout(() => {
                this.message += 'World';
            }, 1500);
        }
        go(state) {
            this.$state.go(state);
        }
        switchLanguage(key) {
            this.$translate.use(key);
        }
    }
};

export default coreComponent;
