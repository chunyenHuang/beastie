import template from './albums.html';
import './albums.styl';

const albumsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class AlbumsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Albums', 'Snapshot'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Albums, Snapshot
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Albums = Albums;
            this.Snapshot = Snapshot;
        }

        $onInit(){
            // this.takeSnapshot();
        }

        takeSnapshot() {
            this.Snapshot().then((image) => {
                this.pet.picture = image;
            });
        }

    }
};
export default albumsComponent;
