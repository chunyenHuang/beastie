import transactionsComponent from './Transactions.component';
import dashboardComponent from './Dashboard';
import newTransactions from './NewTransactions';
import list from './List';

import transactionsService from './services/Transactions.service';
import TransactionsDialogService from './services/TransactionsDialog.service';


const transactionsModule = angular
    .module('beastie.transactions', [])
    .component('transactions', transactionsComponent)
    .component('transactionsDashboard', dashboardComponent)
    .component('transactionsNew', newTransactions)
    .component('transactionsList', list)
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
            .state('core.transactions.list', {
                url: '/list',
                template: `
                <transactions-list layout="column" flex></transactions-list>
                `
            })
            .state('core.transactions.dashboard', {
                url: '/dashboard',
                template: `
                <transactions-dashboard layout="column" flex></transactions-dashboard>
                `
            });
    })
    .name;

export default transactionsModule;
