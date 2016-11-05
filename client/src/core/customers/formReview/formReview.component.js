import template from './formReview.html';
import './formReview.styl';

const formReviewComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class FormReviewController {
        static get $inject() {
            return ['$log', '$timeout', '$scope'];
        }
        constructor($log, $timeout, $scope) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
        }
    }
};
export default formReviewComponent;
