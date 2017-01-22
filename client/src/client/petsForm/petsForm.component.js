import template from './petsForm.html';
import './petsForm.styl';

const petsFormComponent = {
    template,
    bindings: {
        petId: '<',
        mode: '@'
    },
    controller: /* @ngInject */ class PetsFormController {
        static get $inject() {
            return [
                '$log', '$timeout', '$scope', '$state', '$stateParams', '$window', '$http',
                'Pets',
                'ListItems', 'Snapshot', 'SharedUtil', 'CustomerDetailDialog', '$mdDialog'
            ];
        }
        constructor(
            $log, $timeout, $scope, $state, $stateParams, $window, $http, Pets,
            ListItems, Snapshot, SharedUtil, CustomerDetailDialog, $mdDialog
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$window = $window;
            this.$http = $http;
            this.Pets = Pets;
            this.ListItems = ListItems;
            this.Snapshot = Snapshot;
            this.SharedUtil = SharedUtil;
            this.CustomerDetailDialog = CustomerDetailDialog;
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
                        this.$timeout(() => {
                            this.preview = event.target.result;
                        });
                    };
                }
            };
            this.$scope.uploadVaccination = (fileInput) => {
                if (fileInput.length > 0) {
                    this.uploadVaccination(fileInput[0]);
                }
            };

        }

        $onInit() {
            this.selectedTab = 0;
            this.tabs = [{
                name: 'Basic',
                value: 0
            }, {
                name: 'Vaccinations',
                value: 1
            }, {
                name: 'Additional Notes',
                value: 2
            }];

            this.durationOptions = [{
                name: '3 Years',
                value: 3
            }, {
                name: '1 Year',
                value: 1
            }];
            this.initSetup();
        }

        $onChanges() {
            if (this.petId) {
                this.initSetup();
            }
        }

        initSetup() {
            this.pet = null;
            this.preview = null;
            this.pet_id = this.$stateParams.pet_id || this.petId;
            if (this.pet_id) {
                this.setPet(this.pet_id);
                this.preview = '/images/pets/' + this.pet_id + '.png';
            } else {
                this.setNewPet();
            }
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

        uploadVaccination(file) {
            this.vaccinationsDocuments = this.vaccinationsDocuments || {};
            this.vaccinationsDocuments[this.currentVaccine.keyID] = file;
            this.$timeout(() => {
                this.vaccinationsDocuments = this.vaccinationsDocuments;
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
                for (var i = 0; i < results[0].items.length; i++) {
                    this.vaccinations[results[0].items[i].name] = results[0].items[i];
                    if (results[0].items[i].rejectOrderIfIsExpired) {
                        this.requiredVaccinations.push(results[0].items[i].name);
                    }
                }
            });
        }

        setPet(id) {
            this.Pets.get({
                id: id
            }, (pet) => {
                this.pet = pet;
                this.setLists();
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

            if (this.pet.vaccinations.length != 0) {
                if (!this.pet.vaccinations[this.pet.vaccinations.length - 1].issuedAt) {
                    this.pet.vaccinations.splice(this.pet.vaccinations.length - 1, 1);
                }
            }
            this.pet.vaccinations.push({
                keyID: new Date().getTime(),
                name: vaccine.name,
                issuedAt: null,
                expiredAt: null,
                effectiveDuration: 3,
                createdAt: new Date()
            });
        }

        removeVaccine(vaccine) {
            this.pet.vaccinations.splice(this.pet.vaccinations.indexOf(vaccine), 1);
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
            item.effectiveDuration = parseInt(item.effectiveDuration);
            let copyIssuedAt = angular.copy(item.issuedAt);
            let effectiveYear = copyIssuedAt.setFullYear(item.issuedAt.getFullYear() +
                Number(item.effectiveDuration));
            let effectiveDate = new Date(effectiveYear)
                .setDate(item.issuedAt.getDate() - 1);
            item.expiredAt = new Date(effectiveDate);
        }

        getDaysBeforeDue(date) {
            if (!date) {
                return;
            }
            return Math.ceil(this.SharedUtil.daysBetween(date));
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

        removeEmptyVaccination() {
            const vaccinations = [];
            for (var i = 0; i < this.pet.vaccinations.length; i++) {
                if (this.pet.vaccinations[i].issuedAt &&
                    this.pet.vaccinations[i].expiredAt &&
                    this.pet.vaccinations[i].issuedAt != 'Invalid Date' &&
                    this.pet.vaccinations[i].expiredAt != 'Invalid Date'
                ) {
                    vaccinations.push(this.pet.vaccinations[i]);
                }
            }
            this.pet.vaccinations = vaccinations;
        }

        update() {
            this._clearTextarea();
            if (!this.validate()) {
                this.selectedTab = 0;
                return false;
            }
            /*
                TODO: remove empty vaccinations
                TODO: handle component mode
            */
            if (this.pet['birthday'] == 'Invalid Date') {
                this.pet['birthday'] = null;
            }
            this.removeEmptyVaccination();
            if (!this.pet._id) {
                this.Pets.save(this.pet, (res) => {
                    this._uploadPicture(res._id, () => {
                        this._uploadVaccinationDocuments(res._id, () => {
                            if (this.mode != 'component') {
                                this.$state.go('client.dashboard', {
                                    customer_id: this.$stateParams.customer_id
                                });
                            } else {
                                this.initSetup();
                            }
                        });
                    });
                });
            } else {
                this.Pets.update({
                    id: this.pet._id
                }, this.pet, () => {
                    this._uploadPicture(this.pet._id, () => {
                        this._uploadVaccinationDocuments(this.pet._id, () => {
                            if (this.mode != 'component') {
                                this.$state.go('client.dashboard', {
                                    customer_id: this.$stateParams.customer_id
                                });
                            } else {
                                this.initSetup();
                            }
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
            }, () => {
                callback();
            }, () => {
                callback();
            });
        }

        _uploadVaccinationDocuments(pet_id, callback) {
            const documents = [];
            let extension;
            for (let keyID in this.vaccinationsDocuments) {
                extension = this.vaccinationsDocuments[keyID].name.split('.');
                extension = extension[extension.length - 1];
                documents.push({
                    keyID: keyID,
                    file: this.vaccinationsDocuments[keyID],
                    filename: pet_id + '-' + keyID + '.' + extension
                });
            }
            (function upload(pet_id, documents, index, callback, bindning) {
                if (index == documents.length) {
                    return callback();
                }
                bindning.Pets.uploadVaccinationDocuments({
                    id: pet_id
                }, {
                    pet_id: pet_id,
                    keyID: documents[index].keyID,
                    file: documents[index].file,
                    filename: documents[index].filename
                }).$promise.then(() => {
                    index++;
                    return upload(pet_id, documents, index, callback);
                });
            })(pet_id, documents, 0, callback, this);
        }

        changeTab(val) {
            this.selectedTab += val;
            this.selectedTab = (this.selectedTab < 0) ? 0 : this.selectedTab;
            this.selectedTab = (this.selectedTab > 4) ? 4 : this.selectedTab;
        }

        viewDocument(vaccine) {
            if (this.showDocument == vaccine.document) {
                return this.showDocument = null;
            }
            this.showDocument = vaccine.document;
        }
    }
};
export default petsFormComponent;
