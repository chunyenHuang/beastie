import template from './PetPhotoGallery.html';
import './PetPhotoGallery.styl';

const petPhotoGalleryComponent = {
    template,
    bindings: {
        petId: '<',
        images: '<'
    },
    controller: /* @ngInject */ class PetPhotoGalleryController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Pets',
                '$document',
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Pets,
            $document
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Pets = Pets;
            this.$document = $document;
        }

        $onChanges() {
            if (this.petId) {
                this.imgs = {};
                this.Pets.getPicturesPath({
                    id: this.petId
                }, (res) => {
                    this.sortImgByDate(res);
                });
            }
        }

        sortImgByDate(arr) {
            if (!arr || !arr.length) {
                return;
            }
            angular.forEach(arr, (item) => {
                let dateStr = this.parseUrlToDate(item);
                if (!this.imgs[dateStr]) {
                    this.imgs[dateStr] = [item];
                } else {
                    this.imgs[dateStr].push(item);
                }
            });
        }

        parseUrlToDate(url) {
            if (!url) {
                return;
            }
            let miliSec = Number(url.split('-')[1].split('.')[0]);
            let dateStr = new Date(miliSec).toDateString();
            return dateStr;
        }

        dateStrtoObj(str) {
            if (!str) {
                return;
            }
            return new Date(str);
        }

        toggleLargePic(url) {
            if (!this.previewLargeUrl) {
                this.previewLargeUrl = url;
                this.$document[0].getElementById('preview-large').classList.remove('hide');
            } else {
                this.previewLargeUrl = null;
                this.$document[0].getElementById('preview-large').classList.add('hide');
            }
        }
    }
};
export default petPhotoGalleryComponent;
