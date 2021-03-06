import template from './<%= upCaseName %>Dialog.html';
import './<%= upCaseName %>Dialog.styl';
/* @ngInject */
class <%= upCaseName %>DialogService {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
        this.$document = $document;
        this.$mdDialog = $mdDialog;
        if (!$document[0].getElementById('<%= name %>-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', '<%= name %>-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(
                    locals,
                    $document[0].getElementById('<%= name %>-dialog')
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
            controller: /* @ngInject */ class <%= upCaseName %>DialogServiceController {
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

export default <%= upCaseName %>DialogService;
