import template from './Credits.html';
import './Credits.styl';

const creditsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class CreditsController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;

        }
    }
};
export default creditsComponent;
