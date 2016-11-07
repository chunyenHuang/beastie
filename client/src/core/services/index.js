import snapshotService from './snapshot.service';

const coreServices = angular
    .module('beastie.core.services', [])
    .service('Snapshot', snapshotService)
    .name;

export default coreServices;
