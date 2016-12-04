import template from './AddCreditsDialog.html';
import './AddCreditsDialog.styl';
/* @ngInject */
class AddCreditsDialogService {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
        this.$document = $document;
        this.$mdDialog = $mdDialog;
        if (!$document[0].getElementById('addCredits-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', 'addCredits-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(
                    locals,
                    $document[0].getElementById('addCredits-dialog')
                )
            );
        };
        return showDialog;
    }
    dialog(locals, parent) {
        return {
            locals,
            parent,
            template,
            controller: /* @ngInject */ class AddCreditsDialogServiceController {
                static get $inject() {
                    return ['$injector', '$timeout', '$window', '$mdDialog'];
                }
                constructor($injector, $timeout, $window, $mdDialog) {
                    this.$injector = $injector;
                    this.$timeout = $timeout;
                    this.$window = $window;
                    this.$mdDialog = $mdDialog;
                }

                cancel() {
                    this.$mdDialog.cancel();
                }

                confirm(answer) {
                    this.$mdDialog.hide(answer);
                }
            },
            clickOutsideToClose: false,
            bindToController: true,
            controllerAs: '$ctrl'
        };
    }
}

export default AddCreditsDialogService;
