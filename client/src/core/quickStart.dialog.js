import template from './quickStart.dialog.html';

export default (locals, parent) => ({
    locals,
    parent,
    template: template,
    controller: /* @ngInject */ class OpenDocumentController {
        static get $inject() {
            return [
                '$timeout', '$document', '$mdDialog', 'localStorageService'
            ];
        }
        constructor(
            $timeout, $document, $mdDialog, localStorageService
        ) {
            this.$timeout = $timeout;
            this.$document = $document;
            this.$mdDialog = $mdDialog;
            this.localStorageService = localStorageService;
            this.validateMessage;
            this.history = this.localStorageService.get('beastie-query-history') || [];
        }

        go(inputNumbers) {
            this.phone = inputNumbers || this.phone;
            if (this.validate(inputNumbers)) {
                this.history.unshift(this.phone);
                this.localStorageService.set('beastie-query-history', this.history);
                this.$mdDialog.hide(this.phone);
            } else {
                return;
            }
        }

        quickSelect(phone) {
            this.$mdDialog.hide(phone);
        }

        cancel() {
            this.$mdDialog.cancel();
        }
        reset() {
            this.phone = null;
        }

        validate(inputNumbers) {
            // console.log(inputNumbers);
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
