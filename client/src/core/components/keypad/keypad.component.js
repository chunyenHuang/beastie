import './keypad.styl';
import template from './keypad.html';

const keypadComponent = {
    bindings: {
        limit: '<',
        type: '@', //tel, money
        rightBottomButton: '@',
        onUpdate: '&',
        initValue: '<'
    },
    template: `
        <table class="keypad">
            <tr>
                <td colspan="3" class="keypad-display">
                    <span ng-show="$ctrl.type=='pin'">{{$ctrl.pressed | password}}</span>
                    <span ng-show="$ctrl.type=='tel'">{{$ctrl.pressed | tel}}</span>
                    <span ng-show="$ctrl.type=='money'">{{$ctrl.pressed | number}}</span>
                </td>
            </tr>
            <tr class="key-row" ng-repeat="item in $ctrl.keypadItems">
                <td class="key-cell" ng-repeat="val in item">
                    <md-button
                        md-no-ink
                        class="md-fab md-primary"
                        ng-class="{'keypad-keys': $ctrl.isNumber(val)}"
                        aria-label="{{num}}"
                        md-ripple-size="full"
                        ng-click='$ctrl.keyPress(val)'>
                        {{val}}
                    </md-button>
                </td>
            </tr>
        </table>
    `,
    controller: /* @ngInject */ class KeypadController {
        static get $inject() {
            return ['$log', '$timeout', '$scope'];
        }
        constructor($log, $timeout, $scope) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.pressed = '';
        }
        $onInit() {
            this.keypadItems = this.getKeypadItems();
            if (this.initValue) {
                this.keyPress(this.initValue);
            }
        }
        $onChanges() {}
        $onDestroy() {}
        $postLink() {}
        getKeypadItems() {
            const rightBottomButton = this.rightBottomButton || 'back';
            const keypadItems = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                ['clear', 0, rightBottomButton]
            ];
            return keypadItems;
        }
        keyPress(val) {
            if (this.isLimit() && typeof (val) == 'number') {
                val = '';
            }
            if (val === '.') {
                if (!this.pressed) {
                    val = '0.';
                }
                if (this.pressed.indexOf('.') != -1) {
                    val = '';
                }
            }
            this.pressed = this.combine(this.pressed, val);
            if (this.rightBottomButton == 'enter') {
                if (val == 'enter') {
                    if (this.pressed != '') {
                        this.onUpdate({
                            inputNumbers: this.pressed
                        });
                    }
                    this.pressed = '';
                }
            } else {
                this.onUpdate({
                    inputNumbers: this.pressed
                });
            }
        }
        combine(string, newVal) {
            switch (newVal) {
                case 'enter':
                    return string;
                case 'back':
                    if (string.length > 1) {
                        string = string.slice(0, -1);
                    }
                    return string;
                case 'clear':
                    return '';
                default:
                    string += newVal.toString();
                    return string;
            }
        }
        isLimit() {
            return (this.pressed.length == parseInt(this.limit));
        }
        isNumber(input) {
            return Number.isInteger(input);
        }

    }
};
export default keypadComponent;
