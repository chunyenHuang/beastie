import template from './signature.html';
import './signature.styl';

const signatureComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SignatureController {
        static get $inject() {
            return [
                '$log', '$timeout', '$document', '$state', '$stateParams', '$touch', '$swipe',
                'Signature', 'ListItems', 'Socket'
            ];
        }
        constructor(
            $log, $timeout, $document, $state, $stateParams, $touch, $swipe,
            Signature, ListItems, Socket
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$document = $document;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$touch = $touch;
            this.$swipe = $swipe;
            this.Signature = Signature;
            this.ListItems = ListItems;
            this.Socket = Socket;

        }

        $onInit() {
            this.getWaivers();
            this.setSignatureCanvas();
        }

        getWaivers() {
            this.ListItems.query({
                type: 'waivers'
            }, (waivers) => {
                this.waivers = waivers[0].items;
                this.waiverName = this.$stateParams.waiverName;
            });
        }

        setSignatureCanvas() {
            this.cleanup();
            this.canvas = this.$document[0].getElementById('signature-canvas');
            this.canvas.style.border = '2px solid';

            this.context = this.canvas.getContext('2d');
            // this.context.fillStyle = '#959595';
            // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.$swipe.bind(angular.element(this.canvas), {
                start: (event) => {
                    console.log('start');
                    console.log(event);
                    this.startDrawing(event);
                },
                move: (event) => {
                    console.log('move');
                    this.draw(event);
                },
                end: (event) => {
                    this.stopDrawing(event);
                },
                cancel: () => {
                    console.log('cancel');
                    this.stopDrawing(event);
                }
            })

            // this.canvas.addEventListener('mousedown', (event) => {
            //     console.log(this.$swipe);
            //     this._addClick(event);
            //     this.isDrawing = true;
            //     this._redraw();
            // });
            // this.canvas.addEventListener('mousemove', (event) => {
            //     if (this.isDrawing) {
            //         this._addClick(event);
            //         this._redraw();
            //     }
            // });
            // this.canvas.addEventListener('mouseup', () => {
            //     this.isDrawing = false;
            // });
            // this.canvas.addEventListener('mouseleave', () => {
            //     this.isDrawing = false;
            // });
            //
            // this.canvas.addEventListener('touchstart', (event) => {
            //     this._addClick(event);
            //     this.isDrawing = true;
            //     this._redraw();
            // });
            // this.canvas.addEventListener('touchmove', (event) => {
            //     if (this.isDrawing) {
            //         this._addClick(event);
            //         this._redraw();
            //     }
            // });
            // this.canvas.addEventListener('touchend', () => {
            //     this.isDrawing = false;
            // });


            //
            // this.$document[0].body.addEventListener('touchstart', function (e) {
            //     console.log(e);
            //     if (e.target == this.canvas) {
            //         e.preventDefault();
            //     }
            // }, false);
            // this.$document[0].body.addEventListener('touchend', function (e) {
            //     if (e.target == this.canvas) {
            //         e.preventDefault();
            //     }
            // }, false);
            // this.$document[0].body.addEventListener('touchmove', function (e) {
            //     if (e.target == this.canvas) {
            //         e.preventDefault();
            //     }
            // }, false);
            //
        }

        cleanup() {
            if (this.context) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.signature = null;
            this.context = null;
            this.clickX = [];
            this.clickY = [];
            this.clickDrag = [];
        }

        getMousePos(event, canvas) {
            canvas = canvas || this.canvas;
            const rect = canvas.getBoundingClientRect();
            if (event.target) {
                event.X = event.clientX;
                event.Y = event.clientY;

            } else {
                event.X = event.x;
                event.Y = event.y;
            }

            return {
                x: event.X - rect.left,
                y: event.Y - rect.top
            };
        }

        erase() {
            this.setSignatureCanvas();
        }

        save() {
            const dataURL = this.canvas.toDataURL();
            this.signature = dataURL;
        }

        startDrawing(event) {
            this._addClick(event);
            this.isDrawing = true;
            this._redraw();
        }

        stopDrawing() {
            this.isDrawing = false;
        }

        _addClick(event) {
            console.log(event);
            const pos = this.getMousePos(event);
            this.clickX.push(pos.x);
            this.clickY.push(pos.y);
            this.clickDrag.push(this.isDrawing);
        }

        draw(event) {
            if (!this.isDrawing) {
                return;
            }
            this._addClick(event);
            this._redraw();
        }

        _redraw() {
            const context = this.context;
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.strokeStyle = '#000000';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            for (var i = 0; i < this.clickX.length; i++) {
                context.beginPath();
                if (this.clickDrag[i] && i) {
                    context.moveTo(this.clickX[i - 1], this.clickY[i - 1]);
                } else {
                    context.moveTo(this.clickX[i] - 1, this.clickY[i]);
                }
                context.lineTo(this.clickX[i], this.clickY[i]);
                context.closePath();
                context.stroke();
            }
        }

    }
};
export default signatureComponent;
