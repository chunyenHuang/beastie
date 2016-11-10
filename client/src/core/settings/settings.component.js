import template from './settings.html';
import './settings.styl';

const settingsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SettingsController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'Settings'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            Settings
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.Settings = Settings;
        }

        $onInit() {
            this.Settings.query({}, (settings) => {
                this.settings = settings;
                this.company = this.findInArray(this.settings, 'type', 'company');
            });
        }

        findInArray(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] == value) {
                    return array[i];
                }
            }
            return null;
        }
    }
};
export default settingsComponent;