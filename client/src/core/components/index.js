import keypad from './keypad';

const componentModule = angular
    .module('beastie.core.components', [])
    .component('keypad', keypad)
    .name;

export default componentModule;
