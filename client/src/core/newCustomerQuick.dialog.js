import template from './newCustomerQuick.dialog.html';

export default (locals, parent) => ({
    locals,
    parent,
    template: template,
    controller: /* @ngInject */ class OpenDocumentController {
        static get $inject() {
            return [
                '$timeout', '$document', '$mdDialog', 'Customers', 'Pets'
            ];
        }
        constructor(
            $timeout, $document, $mdDialog, Customers, Pets
        ) {
            this.$timeout = $timeout;
            this.$document = $document;
            this.$mdDialog = $mdDialog;
            this.Customers = Customers;
            this.Pets = Pets;

            this.pets = [];
            this.Customers.get({
                id: 'template'
            }, (template) => {
                this.customer = template;
                this.customer.phone = this.phone;
                // console.log(this.customer);
            });
            this.Pets.get({
                id: 'template'
            }, (template) => {
                this.petTemplate = template;
                this.pets.push(this.petTemplate);
                // console.log(this.pets);
            });
        }

        closeDialog(){
            this.$mdDialog.hide(this.customer);
        }

        cancel() {
            this.$mdDialog.cancel();
        }

        create() {
            this.isBusy = true;
            this.Customers.save(this.customer, (res) => {
                this.customer = res;
                this.savedPets = 0;
                for (var i = 0; i < this.pets.length; i++) {
                    this.pets[i].customer_id = res._id;
                    this.Pets.save(this.pets[i], ()=>{
                        this.savedPets++;
                        if(this.savedPets==this.pets.length){
                            this.closeDialog();
                        }
                    });
                }
            });
        }

        addPet() {
            if (this.pets[this.pets.length - 1].name) {
                this.pets.push(this.petTemplate);
            } else {
                return;
            }
        }

        validate() {
            if (!this.customer || !this.pets) {
                return false;
            } else if (!this.customer.firstname ||
                !this.customer.lastname ||
                !this.customer.phone ||
                !this.pets[0].name
            ) {
                return false;
            } else {
                return true;
            }
        }
    },
    clickOutsideToClose: false,
    bindToController: true,
    controllerAs: '$ctrl'
});
