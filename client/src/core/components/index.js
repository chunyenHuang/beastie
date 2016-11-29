import keypad from './keypad';
import fullscreen from './fullscreen';
import daySchedule from './daySchedule';

const componentModule = angular
    .module('beastie.core.components', [])
    .component('keypad', keypad)
    .component('fullscreen', fullscreen)
    .component('daySchedule', daySchedule)
    .name;

export default componentModule;
