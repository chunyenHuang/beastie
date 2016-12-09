import template from './petsForm.html';
import './petsForm.styl';

const petsFormComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class PetsFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$scope', '$state', '$stateParams', '$window', 'Pets',
                'ListItems', 'Snapshot', 'SharedUtil', '$mdDialog'
            ];
        }
        constructor(
            $log, $timeout, $scope, $state, $stateParams, $window, Pets,
            ListItems, Snapshot, SharedUtil, $mdDialog
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$window = $window;
            this.Pets = Pets;
            this.ListItems = ListItems;
            this.Snapshot = Snapshot;
            this.SharedUtil = SharedUtil;
            this.$mdDialog = $mdDialog;
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
            this.$scope.changePicture = (fileInput) => {
                if (fileInput.length > 0) {
                    this.inputPicture = fileInput[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(this.inputPicture);
                    reader.onload = (event) => {
                        this.$timeout(()=>{
                            this.preview = event.target.result;
                        });
                    };
                }
            };
        }

        $onInit() {
            this.pet = null;
            this.preview = null;
            console.log(this.$stateParams.pet_id);
            if (this.$stateParams.pet_id) {
                this.setPet(this.$stateParams.pet_id);
                this.preview = '/images/pets/' + this.$stateParams.pet_id + '.png';
            } else {
                this.setNewPet();
            }
            // this.petVaccinationsNameList = [];
        }

        backToDashboard() {
            this.$state.go('client.dashboard', {
                customer_id: this.$stateParams.customer_id
            });
        }

        takeSnapshot() {
            this.Snapshot().then((res) => {
                this.inputPicture = res.blob;
                this.preview = res.dataUrl;
            });
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
                this.vaccinations = {};
                this.requiredVaccinations = [];
                angular.forEach(results[0].items, (item) => {
                    this.vaccinations[item.name] = item;
                    if (item.rejectOrderIfIsExpired) {
                        this.requiredVaccinations.push(item.name);
                    }
                });
                this._applyVaccineToPet();
                // this._genVaccinationsNameList(this.pet.vaccinations);
                // this._applyVaccineToPet();
            });
        }

        setPet(id) {
            this.Pets.get({
                id: id
            }, (pet) => {
                // pet.birthday = new Date(pet.birthday);
                this.pet = pet;
                this.setLists();
                // this._parseVaccinationDate();
            }, () => {
                this.setNewPet();
            });
        }

        setNewPet() {
            this.Pets.get({
                id: 'template'
            }, (template) => {
                this.pet = template;
                this.pet.customer_id = this.$stateParams.customer_id;
                this.pet.species = 'dog';
                this.setLists();
            });
        }

        addVaccine(vaccine) {
            if (!this.pet) {
                return;
            }
            this.pet.vaccinations =
                (angular.isArray(this.pet.vaccinations)) ? this.pet.vaccinations : [];
            this.pet.vaccinations.push({
                name: vaccine.name,
                issuedAt: null,
                expiredAt: null
            });
        }

        _applyVaccineToPet() {
            for (let i = 0; i < this.vaccinations.length; i++) {
                if (this.petVaccinationsNameList.indexOf(this.vaccinations[i].name) < 0) {
                    if (!this.pet.vaccinations || !angular.isArray(this.pet.vaccinations)) {
                        this.pet.vaccinations = [];
                    }
                    this.pet.vaccinations.push({
                        name: this.vaccinations[i].name,
                        issuedAt: null,
                        expiredAt: null,
                        createdAt: new Date()
                    });
                }
            }
        }

        _genVaccinationsNameList(vaccinations) {
            if (!angular.isArray(vaccinations)) {
                return;
            }
            for (let i = 0; i < vaccinations.length; i++) {
                this.petVaccinationsNameList.push(vaccinations[i].name);
            }
        }

        _parseVaccinationDate() {
            if (!this.pet.vaccinations || !angular.isArray(this.pet.vaccinations)) {
                return;
            }
            for (let i = 0; i < this.pet.vaccinations.length; i++) {
                this.pet.vaccinations[0].issuedAt =
                    new Date(this.pet.vaccinations[0].issuedAt);
                this.pet.vaccinations[0].expiredAt =
                    new Date(this.pet.vaccinations[0].expiredAt);
            }
        }

        setDaysBeforeExpire(item, vaccineName) {
            let copyIssuedAt = angular.copy(item.issuedAt);
            let effectiveYear = copyIssuedAt.setFullYear(item.issuedAt.getFullYear() +
                Number(item.effectiveDuration));
            let effectiveDate = new Date(effectiveYear)
                .setDate(item.issuedAt.getDate() - 1);
            item.expiredAt = new Date(effectiveDate);

            item.daysBeforeDue = Math.ceil(this.SharedUtil.daysBetween(item.expiredAt));
            if (item.daysBeforeDue < this.vaccinations[vaccineName].remindCustomerWithinDays) {
                const prompt = this.$mdDialog.prompt()
                    .title(item.name + ' Vaccine Due In ' + item.daysBeforeDue + ' Days!')
                    // .textContent('Bowser is a common name.')
                    // .placeholder('Phone Number')
                    // .ariaLabel('Phone Number')
                    // .ok('Go')
                    .cancel('Got It')
                    .clickOutsideToClose(false);

                this.$mdDialog.show(prompt);
            }
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

        _clearTextarea() {
            const cleanSpCond = [];
            for (let i = 0; i < this.pet.specialConditions.length; i++) {
                if (this.pet.specialConditions[i].description &&
                    this.pet.specialConditions[i].description !== 'Please describe.') {
                    cleanSpCond.push(this.pet.specialConditions[i]);
                }
            }
            const cleanAdInstruct = [];
            for (let i = 0; i < this.pet.additionalInstructions.length; i++) {
                if (this.pet.additionalInstructions[i].description &&
                    this.pet.additionalInstructions[i].description !== 'Please describe.') {
                    cleanAdInstruct.push(this.pet.additionalInstructions[i]);
                }
            }
            this.pet.specialConditions = cleanSpCond;
            this.pet.additionalInstructions = cleanAdInstruct;
        }

        validate() {
            if (!this.pet) {
                return false;
            } else if (!this.pet.name) {
                this.errorMessage = 'You must give your pet a name.';
                return false;
            } else {
                this.errorMessage = null;
                return true;
            }

        }

        checkVaccination() {
            for (var i = 0; i < this.pet.vaccinations.length; i++) {
                if (
                    this.requiredVaccinations.indexOf(this.pet.vaccinations[i].name) > -1 &&
                    (!this.pet.vaccinations[i].expiredAt && !this.pet.vaccinations[i].issuedAt)
                ) {
                    this.errorMessage = this.pet.vaccinations[i].name + ' is required. ';
                    return false;
                }
            }
            this.errorMessage = null;
            return true;
        }

        update() {
            this._clearTextarea();
            if (!this.validate()) {
                this.selectedTab = 0;
                return false;
            }
            // if (!this.checkVaccination()) {
            //     this.selectedTab = 1;
            //     return false;
            // }
            if (this.pet['birthday'] == 'Invalid Date') {
                this.pet['birthday'] = null;
            }
            if (!this.pet._id) {
                this.Pets.save(this.pet, (res) => {
                    this._uploadPicture(res._id, () => {
                        this.$state.go('client.dashboard', {
                            customer_id: this.$stateParams.customer_id
                        });
                    });
                });
            } else {
                this.Pets.update({
                    id: this.pet._id
                }, this.pet, (res) => {
                    this._uploadPicture(this.pet._id, () => {
                        this.$state.go('client.dashboard', {
                            customer_id: this.$stateParams.customer_id
                        });
                    });
                });
            }
        }

        _uploadPicture(pet_id, callback) {
            if (!this.inputPicture) {
                return callback();
            }
            const timestamp = new Date().getTime();
            this.Pets.uploadPicture({
                id: pet_id
            }, {
                pet_id: pet_id,
                file: this.inputPicture,
                filename: pet_id + '-' + timestamp + '.png'
            }, (res) => {
                // this will return url for the last pictures
                console.log(res);
                callback();
            }, (err) => {
                console.log(err);
                callback();
            });
        }

        changeTab(val) {
            this.selectedTab += val;
            this.selectedTab = (this.selectedTab < 0) ? 0 : this.selectedTab;
            this.selectedTab = (this.selectedTab > 4) ? 4 : this.selectedTab;
        }

    }
};
export default petsFormComponent;
