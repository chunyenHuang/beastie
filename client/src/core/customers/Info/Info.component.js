import template from './Info.html';
import './Info.styl';

const infoComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class InfoController {
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
export default infoComponent;
