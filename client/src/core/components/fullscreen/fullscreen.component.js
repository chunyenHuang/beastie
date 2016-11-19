import template from './fullscreen.html';
import './fullscreen.styl';

const fullscreenComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class FullscreenController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Fullscreen'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Fullscreen
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Fullscreen = Fullscreen;
        }

        toggleFullscreen() {
            if (this.Fullscreen.isEnabled()) {
                this.Fullscreen.cancel();
            } else {
                this.Fullscreen.all();
                this.showFullScreenButton = false;
            }
        }

        icon() {
            return (this.Fullscreen.isEnabled()) ? 'fullscreen' : 'fullscreen-exit';
        }
    }
};
export default fullscreenComponent;
