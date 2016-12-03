import snapshotService from './snapshot.service';
import TaskService from './task.service';
import TransactionsService from './transactions.service';

const coreServices = angular
    .module('beastie.core.services', [])
    .service('Snapshot', snapshotService)
    .service('Task', TaskService)
    .service('Transactions', TransactionsService)
    .name;

export default coreServices;
