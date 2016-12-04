import template from './petPhotoGallery.html';
import './petPhotoGallery.styl';

const petPhotoGalleryComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class PetPhotoGalleryController {
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
    }
};
export default petPhotoGalleryComponent;
