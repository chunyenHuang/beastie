import keypad from './keypad';
import fullscreen from './fullscreen';

const componentModule = angular
    .module('beastie.core.components', [])
    .component('keypad', keypad)
    .component('fullscreen', fullscreen)
    .name;

export default componentModule;
