import template from './signature.html';
import './signature.styl';

const signatureComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SignatureController {
        static get $inject() {
            return [
                '$log', '$timeout', '$document', '$state', '$stateParams',
                'Signatures', 'ListItems', 'Socket'
            ];
        }
        constructor(
            $log, $timeout, $document, $state, $stateParams,
            Signatures, ListItems, Socket
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$document = $document;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Signatures = Signatures;
            this.ListItems = ListItems;
            this.Socket = Socket;
        }

        $onInit() {
            console.log(this.$stateParams);
            this.getWaivers();
            this.setSignatureCanvas();
            this.$timeout(() => {
                this.showSaveButton = true;
            }, 3500);
        }

        getWaivers() {
            this.ListItems.query({
                type: 'waivers'
            }, (waivers) => {
                for (var i = 0; i < waivers[0].items.length; i++) {
                    if (waivers[0].items[i].name == this.$stateParams.name) {
                        this.waiver = waivers[0].items[i];
                    }
                }
            });
        }

        isSigned() {
            console.log(this.emptyCanvas.toDataURL()==this.canvas.toDataURL());
            return this.emptyCanvas.toDataURL() != this.canvas.toDataURL();
        }

        setSignatureCanvas() {
            this.cleanup();
            this.canvas = this.$document[0].getElementById('signature-canvas');
            this.canvas.style.border = '2px solid';
            this.canvas.width = 800;
            this.canvas.height = 400;
            this.context = this.canvas.getContext('2d');
            this.context.fillStyle = '#b8b8b8';
            this.context.font = '40px Georgia';
            this.context.fillText('Please sign here', 250, 150);
            this.context.fillStyle = '#000000';

            // this.context.fillStyle = '#959595';
            // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // this.$swipe.bind(angular.element(this.canvas), {
            //     start: (event) => {
            //         console.log('start');
            //         console.log(event);
            //         this.startDrawing(event);
            //     },
            //     move: (event) => {
            //         console.log('move');
            //         this.draw(event);
            //     },
            //     end: (event) => {
            //         console.log('end');
            //         this.stopDrawing(event);
            //     },
            //     cancel: () => {
            //         console.log('cancel');
            //         this.stopDrawing(event);
            //     }
            // });

            this.canvas.addEventListener('mousedown', (event) => {
                // console.log(this.$swipe);
                event.preventDefault();
                this._addClick(event);
                this.isDrawing = true;
                this._redraw();
            });
            this.canvas.addEventListener('mousemove', (event) => {
                event.preventDefault();
                if (this.isDrawing) {
                    this._addClick(event);
                    this._redraw();
                }
            });
            this.canvas.addEventListener('mouseup', () => {
                this.isDrawing = false;
            });
            this.canvas.addEventListener('mouseleave', () => {
                this.isDrawing = false;
            });

            this.canvas.addEventListener('touchstart', (event) => {
                event.preventDefault();
                // console.log('touchstart');
                this._addClick(event);
                this.isDrawing = true;
                this._redraw();
            });
            this.canvas.addEventListener('touchmove', (event) => {
                event.preventDefault();
                // console.log('touchmove');
                if (this.isDrawing) {
                    this._addClick(event);
                    this._redraw();
                }
            });
            this.canvas.addEventListener('touchend', () => {
                console.log('touchend');
                this.isDrawing = false;
            });

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
                event.X = event.clientX || event.touches[0].clientX;
                event.Y = event.clientY || event.touches[0].clientY;
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
            console.log(this.Signatures);
            const dataURL = this.canvas.toDataURL();
            this.signature = dataURL;
            this.Signatures.save({
                customer_id: this.$stateParams.customer_id,
                order_id: this.$stateParams.order_id,
                name: this.waiver.name,
                description: this.waiver.description,
                signatures: this.signature
            }, (res) => {
                this.$state.go('client.customersCheckIn');
                console.log(res);
            }, (err) => {
                console.log(err);
            });
        }

        startDrawing(event) {
            this._addClick(event);
            this.isDrawing = true;
            this._redraw();
        }

        stopDrawing() {
            this.$timeout(() => {
                this.isDrawing = false;
            }, 500);
        }

        _addClick(event) {
            console.log(event);
            const pos = this.getMousePos(event);
            this.clickX.push(pos.x);
            this.clickY.push(pos.y);
            this.clickDrag.push(this.isDrawing);
            console.log(pos.x, pos.y);

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
