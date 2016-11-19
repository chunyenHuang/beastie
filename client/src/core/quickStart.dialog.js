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

        go(inputNumbers) {
            this.phone = inputNumbers || this.phone;
            if(this.validate(inputNumbers)){
                this.$mdDialog.hide(this.phone);
            } else {
                return;
            }
        }

        cancel() {
            this.$mdDialog.cancel();
        }
        reset(){
            this.phone = null;
        }

        validate(inputNumbers) {
            console.log(inputNumbers);
            inputNumbers = inputNumbers || this.phone;
            if (!inputNumbers) {
                // this.validateMessage = 'Please enter phone number';
                return false;
            }
            if (inputNumbers.length != 10) {
                return false;
            }
            angular.forEach(inputNumbers, (char) => {
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
