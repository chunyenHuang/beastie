import template from './settings.html';
import './settings.styl';

const settingsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SettingsController {
        static get $inject() {
            return [
                '$log', '$scope', '$timeout', '$state', '$stateParams',
                'Settings'
            ];
        }
        constructor(
            $log, $scope, $timeout, $state, $stateParams,
            Settings
        ) {
            this.$log = $log;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Settings = Settings;

            this.$scope.$watch('$ctrl.syncDir', (dir) => {
                console.log(dir);
            });
        }

        $onInit() {
            this.selected = 'printer';
            this.Settings.query({}, (settings) => {
                this.settings = settings;
                this.company = this.findInArray(this.settings, 'type', 'company');
                this.officeHours = this.findInArray(this.settings, 'type', 'officeHours');
            });
        }
        select(type) {
            this.selected = type;
        }

        print(dir) {
            console.log(dir);
        }

        findInArray(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] == value) {
                    return array[i];
                }
            }
            return null;
        }

        update() {
            switch (this.selected) {
                case 'company':
                    this.Settings.update({
                        id: this.company._id
                    }, this.company).$promise.then((res) => {
                        console.log(res);
                    });
                    break;
                case 'officeHours':
                    this.Settings.update({
                        id: this.officeHours._id
                    }, this.officeHours).$promise.then((res) => {
                        console.log(res);
                    });
                    break;
                default:
            }
        }
    }
};
export default settingsComponent;
