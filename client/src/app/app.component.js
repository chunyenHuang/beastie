import './app.styl';
import template from './app.html';

const appComponent = {
    template,
    controller: /* @ngInject */ class AppController {
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
    },
};

export default appComponent;
