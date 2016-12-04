import snapshotService from './snapshot.service';
import TaskService from './task.service';

const coreServices = angular
    .module('beastie.core.services', [])
    .service('Snapshot', snapshotService)
    .service('Task', TaskService)
    .name;

export default coreServices;
