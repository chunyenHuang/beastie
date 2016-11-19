import albumsComponent from './albums.component';
import albumsService from './services/albums.service';

const albumsModule = angular
    .module('beastie.core.albums', [])
    .component('albums', albumsComponent)
    .service('Albums', albumsService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.albums', {
                url: '/albums',
                template: '<albums layout="column" flex></albums>'
            });
    })
    .name;

export default albumsModule;
