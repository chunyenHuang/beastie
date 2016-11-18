import template from './dashboard.html';
import './dashboard.styl';

const dashboardComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class DashboardController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
        }
        $onInit(){
            console.log(this.$stateParams);
        }
    }
};
export default dashboardComponent;
