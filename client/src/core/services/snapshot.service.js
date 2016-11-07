import './snapshot.service.styl';
import template from './snapshot.service.html';
/* @ngInject */
class snapshotService {
    static get $inject() {
        return ['$document', '$window', '$mdDialog'];
    }
    constructor($document, $window, $mdDialog) {
        this.$document = $document;
        this.$window = $window;
        this.$mdDialog = $mdDialog;
    }

    start(callback) {
        this.$mdDialog.show(
            this.preview()
        ).then((image) => {
            return callback(image);
        });
    }

    preview(locals, parent) {
        let appendDiv = this.$document[0].getElementById('snapshot-div');
        if (!appendDiv) {
            appendDiv = this.$document[0].createElement('div');
            appendDiv.setAttribute('id', 'snapshot-div');
            this.$document[0].body.appendChild(appendDiv);
        }
        parent = appendDiv;
        return {
            locals: locals,
            parent: parent,
            template: template,
            controller: /* @ngInject */ class PreviewController {
                static get $inject() {
                    return ['$injector', '$document', '$window', '$mdDialog'];
                }
                constructor($injector, $document, $window, $mdDialog) {
                    this.$injector = $injector;
                    this.$document = $document;
                    this.$window = $window;
                    this.$mdDialog = $mdDialog;
                    $window.navigator.getUserMedia = $window.navigator.getUserMedia ||
                        $window.navigator.webkitGetUserMedia || $window.navigator.mozGetUserMedia ||
                        $window.navigator.msGetUserMedia || $window.navigator.oGetUserMedia;
                    console.log($window.navigator.getUserMedia);
                    if ($window.navigator.getUserMedia) {
                        $window.navigator.getUserMedia({
                            video: {
                                // facingMode: 'user',  // front camera
                                // facingMode: { exact: 'environment' }, // rear camera
                                width: {
                                    min: 1024,
                                    ideal: 1280,
                                    max: 1920
                                },
                                height: {
                                    min: 576,
                                    ideal: 720,
                                    max: 1080
                                }
                            }
                        }, (stream) => {
                            this.video = $document[0].getElementById('camera');
                            this.video.src = $window.URL.createObjectURL(stream);
                            this.video.onloadedmetadata = (err) => {
                                if (err) {
                                    return console.log(err);
                                }
                                this.video.play();
                            };

                        }, (err) => {
                            console.log(err);
                        });
                    }
                }

                hide() {
                    this.cleanup();
                    this.$mdDialog.hide();
                }

                retake() {
                    this.video.play();
                }

                takePhoto() {
                    this.video.pause();
                }

                finish() {
                    const canvas = this.$document[0].getElementById('snapshot');
                    const context = canvas.getContext('2d');
                    canvas.width = this.video.videoWidth;
                    canvas.height = this.video.videoHeight;
                    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/png');
                    this.$mdDialog.hide(dataUrl);
                }
            },
            clickOutsideToClose: false,
            bindToController: true,
            controllerAs: '$ctrl',
            onRemoving: () => {}
        };
    }

}

export default snapshotService;
