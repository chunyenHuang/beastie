import transactionsComponent from './Transactions.component';
import newTransactions from './NewTransactions';

import transactionsService from './services/Transactions.service';
import TransactionsDialogService from './services/TransactionsDialog.service';

const transactionsModule = angular
    .module('beastie.transactions', [])
    .component('transactions', transactionsComponent)
    .component('transactionsNew', newTransactions)
    .service('Transactions', transactionsService)
    .service('TransactionsDialog', TransactionsDialogService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('core.transactions', {
                url: '/transactions',
                template: `
                <transactions layout="column" flex></transactions>
                `
            })
            .state('core.transactions.new', {
                url: '/new',
                template: `
                <transactions-new layout="column" flex></transactions-new>
                `
            })
            ;
    })
    .name;

export default transactionsModule;
