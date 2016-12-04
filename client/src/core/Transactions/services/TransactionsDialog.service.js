import template from './TransactionsDialog.html';
import './TransactionsDialog.styl';
/* @ngInject */
class TransactionsDialogService {
    static get $inject() {
        return [
            '$document', '$mdDialog'
        ];
    }
    constructor($document, $mdDialog) {
        this.$document = $document;
        this.$mdDialog = $mdDialog;
        if (!$document[0].getElementById('transactions-dialog')) {
            const div = $document[0].createElement('div');
            div.setAttribute('id', 'transactions-dialog');
            $document[0].body.appendChild(div);
        }
        const showDialog = (locals) => {
            return $mdDialog.show(
                this.dialog(
                    locals,
                    $document[0].getElementById('transactions-dialog')
                )
            );
        };
        return showDialog;
    }
    dialog(locals, parent) {
        return {
            // locals: {
            // id: locals.id,
            // selfService_id: locals.selfService_id,
            // order_id: locals.order_id,
            // customer_id: locals.customer_id,
            // total: locals.total
            // },
            locals,
            parent,
            template,
            controller: /* @ngInject */ class TransactionsDialogServiceController {
                static get $inject() {
                    return [
                        '$injector', '$timeout', '$window', '$mdDialog',
                        'Transactions', 'Orders', 'SelfServices', 'Customers',
                        'Credits',
                        'ListItems'
                    ];
                }
                constructor(
                    $injector, $timeout, $window, $mdDialog,
                    Transactions, Orders, SelfServices, Customers,
                    Credits,
                    ListItems
                ) {
                    this.$injector = $injector;
                    this.$timeout = $timeout;
                    this.$window = $window;
                    this.$mdDialog = $mdDialog;
                    this.Transactions = Transactions;
                    this.Orders = Orders;
                    this.SelfServices = SelfServices;
                    this.Customers = Customers;
                    this.Credits = Credits;
                    this.ListItems = ListItems;
                    this.tax = 0.09;

                    this.resetTransaction();
                    if (this.order_id) {
                        this.Orders.get({
                            id: this.order_id
                        }, (order) => {
                            const price = order.total || order.services.price;
                            this.transaction = Object.assign(this.transaction, {
                                total: price,
                                order_id: order._id,
                                customer_id: order.customer_id
                            });
                            this.oriMoney = angular.copy(price);
                        });
                    }
                    if (this.selfService_id) {
                        this.SelfServices.get({
                            id: this.selfService_id
                        }, (selfService) => {
                            console.log(selfService);
                            this.transaction = Object.assign(this.transaction, {
                                total: selfService.total,
                                selfService_id: selfService._id,
                                customer_id: selfService.customer_id
                            });
                            this.oriMoney = angular.copy(selfService.total);
                        });
                    }
                    if (this.credit_id) {
                        this.Credits.get({
                            customer_id: this.customer_id
                        }, (credit) => {
                            this.transaction = Object.assign(this.transaction, {
                                total: credit.balance,
                                credit_id: credit._id,
                                customer_id: credit.customer_id
                            });
                            this.oriMoney = angular.copy(credit.balance);
                        });
                    }
                }

                cleanup() {
                    this.order_id = null;
                    this.customer_id = null;
                    this.credit_id = null;
                    this.selfService_id = null;
                    this.resetTransaction();
                }

                resetTransaction(){
                    this.transaction = {
                        // credit_id: null,
                        // selfService_id: null,
                        // order_id: null,
                        // customer_id: null,
                        total: null,
                        isTaxIncluded: false,
                        paymentTransactionsNumber: null,
                        note: null,
                        isVoidedAt: null,
                        createdAt: null
                    };
                }

                updateTotal(inputNumbers) {
                    console.log(this.oriMoney);
                    console.log(inputNumbers);
                    if (inputNumbers) {
                        this.transaction.total = parseFloat(inputNumbers);
                    } else {
                        console.log(inputNumbers);
                        this.transaction.total = angular.copy(this.oriMoney);
                    }
                    console.log(this.transaction.total);
                }

                getTotalWithTax(total) {
                    if (!this.transaction.isTaxIncluded) {
                        total =
                            parseFloat(
                                Number(total * (1 + this.tax)).toFixed(2)
                            );
                    }
                    return total;
                }

                confirm() {
                    const obj = Object.assign(this.transaction, {
                        total: this.getTotalWithTax(this.transaction.total)
                    });
                    console.log(this);
                    console.log(obj);

                    this.Transactions.checkout(obj, (res) => {
                        console.log(res);
                        this.cleanup();
                        this.$mdDialog.hide(res);
                    }, (err) => {
                        console.log(err);
                    });
                }

                cancel() {
                    this.cleanup();
                    this.$mdDialog.cancel();
                }
            },
            clickOutsideToClose: false,
            bindToController: true,
            controllerAs: '$ctrl'
        };
    }
}

export default TransactionsDialogService;
