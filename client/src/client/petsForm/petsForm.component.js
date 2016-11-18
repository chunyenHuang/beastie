import template from './petsForm.html';
import './petsForm.styl';

const petsFormComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class PetsFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams', 'Pets', 'ListItems', 'Snapshot', 'SharedUtil'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams, Pets, ListItems, Snapshot, SharedUtil
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Pets = Pets;
            this.ListItems = ListItems;
            this.Snapshot = Snapshot;
            this.SharedUtil = SharedUtil;
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
            this.VaccinationsNameList = [];
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
            this.ListItems.query({
                type: 'vaccinations'
            }, (results) => {
                this.vaccinations = results[0].items;
                console.log(this.vaccinations);
                this._genVaccinationsNameList(this.vaccinations);
            })
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
                this._parseVaccinationDate();
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
                this.pet.customer_id = this.$stateParams.customer_id
                this.pet.species = 'dog';
            });
        }
        _genVaccinationsNameList(vaccinations) {
            for (let i = 0; i < vaccinations.length; i++) {
                this.VaccinationsNameList.push(vaccinations[i].name);
            }
            console.info(this.VaccinationsNameList)
        }
        _parseVaccinationDate() {
                for (let i = 0; i < this.pet.vaccinations.length; i++) {
                    this.pet.vaccinations[0].issuedAt =
                        new Date(this.pet.vaccinations[0].issuedAt);
                    this.pet.vaccinations[0].expiredAt =
                        new Date(this.pet.vaccinations[0].expiredAt)
                }
            }
            // daysBetween(pasdate, otherdate || now )
        setDaysBeforeExpire(item) {
            let copyIssuedAt = angular.copy(item.issuedAt);
            let effectiveYear = copyIssuedAt.setFullYear(item.issuedAt.getFullYear() +
                Number(item.effectiveDuration));
            let effectiveDate = new Date(effectiveYear)
                .setDate(item.issuedAt.getDate() - 1);
            item.expiredAt = new Date(effectiveDate);

            item.daysBeforeDue = Math.ceil(this.SharedUtil.daysBetween(item.expiredAt));
            // this.dateToday = Date.now();
            // let dateDiff = effectiveTill - this.dateToday;
            // // 1 day = 8.64e+7 milliseconds
            // item.daysBeforeExpire = Math.floor(dateDiff/8.64e+7) + 1;

        }
        addTextarea(name) {
                this.pet[name].push({
                    description: 'Please describe.',
                    createdAt: new Date()
                });
            }
            // _setVaccinations() {
            //     if (this.pet && this.vaccinations) {
            //         this.pet.vaccinations =
            //             Object.assign({}, this.vaccinations, this.pet.vaccinations);
            //             console.info(this.pet.vaccinations);
            //     } else { console.log('_setVaccinations not ready'); }
            // }
        _clearTextarea() {
            const cleanSpCond = []
            for (let i = 0; i < this.pet.specialConditions.length; i++) {
                if (this.pet.specialConditions[i].description &&
                    this.pet.specialConditions[i].description !== 'Please describe.') {
                    cleanSpCond.push(this.pet.specialConditions[i])
                }
            }
            const cleanAdInstruct = []
            for (let i = 0; i < this.pet.additionalInstructions.length; i++) {
                if (this.pet.additionalInstructions[i].description &&
                    this.pet.additionalInstructions[i].description !== 'Please describe.') {
                    cleanAdInstruct.push(this.pet.additionalInstructions[i])
                }
            }
            this.pet.specialConditions = cleanSpCond;
            this.pet.additionalInstructions = cleanAdInstruct;
        }
        validate() {
            if (!this.pet) {
                return false;
            } else if (!this.pet.name) {
                return false;
            } else {
                return true;
            }
        }
        update() {
            console.log(this.pet);
            this._clearTextarea();
            if (this.isNewPet) {
                this.Pets.save(this.pet, (res) => {
                    console.log(res);
                    this.$state.go('client.dashboard');
                });
            } else {
                this.Pets.update({
                    id: this.pet._id
                }, this.pet, (res) => {
                    console.log(res);
                    this.$state.go('client.dashboard');
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
