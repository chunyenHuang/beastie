/* @ngInject */
class transactionService {
    static get $inject() {
        return ['$resource', 'SharedUtil'];
    }
    constructor($resource, SharedUtil) {
        this.SharedUtil = SharedUtil;
        
        const Transactions = $resource('/transactions/:id', {
            id: '@id'
        }, {
            save: {
                method: 'POST',
                url: '/transactions/:id',
                parmas: {
                    id: '@id'  
                },
                transformRequest: (data) => {
                },
                transformResponse: (res)=>{
                }
            },
            update: {
                method: 'PUT',
                url: '/transactions/:id',
                parmas: {
                    id: '@id'  
                },
                transformRequest: (data) => {
                },
                transformResponse: (res)=>{
                }
            },
            getTransaction: {
                method: 'GET',
                url: '/transactions/:id',
                parmas: {
                    id: '@id'  
                },
                isArray: true,
                cache: false
                    // params:{
                    //     from: 'from',
                    //     to: 'to'
                    // },
            },

        });
        
        for(let prop in Transactions){
            this[prop] = Transactions[prop];
        }
        console.log(this)
    }
    
    _getCache(date) {
        date = date || new Date();
        return this.getByDate({date: date}).$promise;
    }
    
    getCache(date) {
        date = date || new Date();
        const dateStr = date.toDateString();
        return new Promise((resolve)=>{
            if (this.orders && this.orders[dateStr]) {
                resolve(this.orders[dateStr])
            } else {
                this.orders = this.orders || {};
                this._getCache(date).then((res)=>{
                    let objFromArr = 
                    Object.assign({}, ...res.map((el)=>{
                        let output = {};
                        output[el._id] = el;
                        return output;
                    }))
                    angular.forEach(objFromArr, (obj)=>{
                        this._setOrderType(obj);
                    })
                    this.orders[dateStr] = objFromArr;
                    resolve(this.orders[dateStr]);
                })
            }
        })
    }
    getOneCache(order) {
        if (!order) {
            return;
        } else {
            let scheduleAt = this.SharedUtil._parseDate(order.scheduleAt);
            if (this.orders && this.orders[scheduleAt.toDateString()]) {
                return this.orders[scheduleAt.toDateString()][order._id];
            }
            return;
        }
    }
    updateCache(order, callback){
        if (!order) {
            return;
        } else {
            let scheduleAt = this.SharedUtil._parseDate(order.scheduleAt);
            if (this.orders && this.orders[scheduleAt.toDateString()]) {
                this._setOrderType(order);
                this.orders[scheduleAt.toDateString()][order._id] = order;
                if (callback) {
                    return callback();
                }
            }
            return;
        }
    }    
    
}


export default transactionService;
