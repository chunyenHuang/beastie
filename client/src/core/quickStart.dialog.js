import template from './quickStart.dialog.html';

export default (locals, parent) => ({
    locals,
    parent,
    template: template,
    controller: /* @ngInject */ class OpenDocumentController {
        static get $inject() {
            return [
                '$timeout', '$document', '$mdDialog'
            ];
        }
        constructor(
            $timeout, $document, $mdDialog
        ) {
            this.$timeout = $timeout;
            this.$document = $document;
            this.$mdDialog = $mdDialog;
            this.validateMessage;
        }

        go() {
            this.$mdDialog.hide(this.phone);
        }

        cancel() {
            this.$mdDialog.cancel();
        }
        reset(){
            this.phone = null;
        }

        validate() {
            console.log(this.phone);
            if (!this.phone) {
                // this.validateMessage = 'Please enter phone number';
                return false;
            }
            if (this.phone.length != 10) {
                return false;
            }
            angular.forEach(this.phone, (char) => {
                if (isNaN(parseInt(char))) {
                    this.validateMessage = 'Invalid phone number';
                    return false;
                }
            });
            return true;
        }
    },
    clickOutsideToClose: false,
    bindToController: true,
    controllerAs: '$ctrl'
});
