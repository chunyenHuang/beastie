import template from './petsForm.html';
import './petsForm.styl';

const petsFormComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class PetsFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Pets', 'ListItems', 'Snapshot'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Pets, ListItems, Snapshot
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Pets = Pets;
            this.ListItems = ListItems;
            this.Snapshot = Snapshot;
            const today = new Date();
            this.birthdayLimit = {
                // min: new Date(
                //     today.getFullYear(),
                //     today.getMonth(),
                //     today.getDate()
                // ),
                max: new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() - 1
                )
            };

        }

        $onInit() {
            if (this.$stateParams.pet_id) {
                this.setPet(this.$stateParams.pet_id);
            } else {
                this.setNewPet();
            }

            this.setLists();
        }

        setLists() {
            this.species = ['dog', 'cat'];
            this.ListItems.query({
                type: 'colors'
            }, (results) => {
                this.colors = results[0].items;
            });
            this.ListItems.query({
                type: 'breeds'
            }, (results) => {
                this.breeds = results[0].items;
            });
        }

        takeSnapshot() {
            this.Snapshot.start((image) => {
                this.pet.picture = image;
            });
        }

        setPet(id) {
            this.Pets.get({
                id: id
            }, (pet) => {
                pet.birthday = new Date(pet.birthday);
                this.pet = pet;
            }, () => {
                this.setNewPet();
            });
        }

        setNewPet() {
            this.Pets.get({
                id: 'template'
            }, (template) => {
                this.isNewPet = true;
                this.pet = template;
                this.pet.species = 'dog';
            });
        }

        update() {
            if (this.isNewPet) {
                this.Pets.save(this.pet, (res) => {
                    console.log(res);
                });
            } else {
                this.Pets.update({
                    id: this.pet._id
                }, this.pet, (res) => {
                    console.log(res);
                });
            }
        }

        changeTab(val) {
            this.selectedTab += val;
            this.selectedTab = (this.selectedTab < 0) ? 0 : this.selectedTab;
            this.selectedTab = (this.selectedTab > 4) ? 4 : this.selectedTab;
        }
    }
};
export default petsFormComponent;
