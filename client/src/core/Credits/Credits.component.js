import template from './Credits.html';
import './Credits.styl';

const creditsComponent = {
    template:`<h1>Credits</h1>`,
    bindings: {

    },
    controller: /* @ngInject */ class CreditsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Credits'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Credits
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Credits = Credits;
            console.log('123');
        }
    }
};
export default creditsComponent;
