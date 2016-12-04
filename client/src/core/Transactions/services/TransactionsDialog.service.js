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
                        'ListItems'
                    ];
                }
                constructor(
                    $injector, $timeout, $window, $mdDialog, 
                    Transactions, Orders, SelfServices, Customers, 
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
                    this.ListItems = ListItems;
                    
                    this.tax = 0.09;

                    if (this.order_id) {
                        this.Orders.get({
                            id: this.order_id
                        }, (order) => {
                            console.log(order);
                            this.total = order.total || order.services.price;
                            this.customer_id = order.customer_id;
                            this.oriMoney = angular.copy(this.total);
                            
                            
                        })
                    }
                    if (this.selfService_id) {
                        this.SelfServices.get({
                            id: this.selfService_id
                        }, (selfService) => {
                            this.total = selfService.total;
                            this.customer_id = selfService.customer_id;
                            this.oriMoney = angular.copy(this.total);
                        })
                    }
                }
                
                updateTotal(inputNumbers) {
                    this.total = inputNumbers;
                }
                
                setIncludeTax(str) {
                    if (str == 'included') {
                        this.includeTax = true;
                    }
                    if (str == 'exculded') {
                        this.includeTax = false;
                    }
                }
                
                setPercentOff(num) {
                    this.percentOff = (1 - num/100);
                }
                
                parseFloat() {
                    return Boolean(parseFloat(this.total));
                }
                
                confirm() {
                    let finalMoney = this.includeTax ? this.total :
                        this.total*(1+this.tax);
                    finalMoney = parseFloat(Number(finalMoney).toFixed(2));
                    // console.log(this.total);
                    // console.log(finalMoney);
                    this.Transactions.checkout({}, {
                        credit_id: null,
                        selfService_id: this.selfService_id || null,
                        order_id: this.order_id || null,
                        customer_id: this.customer_id || null,
                        total:this.total,
                        isTaxIncluded: this.includeTax,
                        paymentTransactionsNumber: null,
                        note: null,
                        isVoidedAt: null,
                        createdAt: null
                    }, (res) => {
                        console.log(res);
                        this.$mdDialog.hide(res);
                    });
                }
                
                cancel() {
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
