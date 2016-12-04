import keypad from './keypad';
import fullscreen from './fullscreen';
import daySchedule from './daySchedule';
import petPhotoGallery from './PetPhotoGallery';

const componentModule = angular
    .module('beastie.core.components', [])
    .component('keypad', keypad)
    .component('fullscreen', fullscreen)
    .component('daySchedule', daySchedule)
    .component('petPhotoGallery', petPhotoGallery)
    .name;

export default componentModule;
