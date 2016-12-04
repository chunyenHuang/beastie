import transactionsComponent from './Transactions.component';
import transactionsService from './services/Transactions.service';
import TransactionsDialogService from './services/TransactionsDialog.service';

const transactionsModule = angular
    .module('beastie.transactions', [])
    .component('transactions', transactionsComponent)
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

            });
    })
    .name;

export default transactionsModule;
