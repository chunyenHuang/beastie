import './core.styl';
import template from './core.html';

const coreComponent = {
    template,
    controller: /* @ngInject */ class CoreController {
        static get $inject() {
            return ['$timeout', 'METADATA'];
        }
        constructor($timeout, METADATA) {
            this.$timeout = $timeout;
            this.METADATA = METADATA;
        }
        $onInit(){
            this.message = 'Hello~';
            this.$timeout(()=>{
                this.message += 'World';
            },1500);
        }
    }
};

export default coreComponent;
