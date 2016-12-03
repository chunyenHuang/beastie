/* @ngInject */
class ordersService {
    static get $inject() {
        return ['$resource', 'SharedUtil'];
    }
    constructor($resource, SharedUtil) {
        this.SharedUtil = SharedUtil;
        
        const Orders = $resource('/orders/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT',
                url: '/orders/:id',
                parmas: {
                    id: '@id'  
                },
                transformRequest: (data) => {
                    
                    // console.warn(data);
                    // console.info(angular.copy(data));
                    // data.test = 'ttttttttttttttt';
                    // return angular.toJson(data);
                    const cpData = angular.copy(data);
                    if (cpData.customers) {
                        delete cpData.customers;
                    }
                    if (cpData.pets) {
                        delete cpData.pets;
                    }
                    if (cpData.type) {
                        delete cpData.type;
                    }
                    if (cpData.scheduleAt) {
                        // console.info(this.orders);
                        this.orders = null;
                        // console.warn(this.orders);
                    }
                    console.warn(cpData);
                    // return cpData;
                    return angular.toJson(cpData);
                },
                transformResponse: (res)=>{
                    if (!res) {
                        return 'error';
                    } else {
                        // res = angular.fromJson(res);
                        // if (res._id) {
                        //     this._setOrderType(res);
                        // }
                        // return res;
                        res = angular.fromJson(res);
                        if (res._id) {
                            // this._setOrderType(res);
                            this.updateCache(res, ()=>{
                                return res;
                            });
                            return res;
                        } else {
                            return res;
                        }
                        
                        // if (this.orders) {
                        //     this.updateCache(res);
                        // }
                    }
                }
                
                //     if (!res) {
                //         return 'error';
                //     } else {
                //         res = angular.fromJson(res);
                //         if (res._id) {
                //             this._setOrderType(res);
                //             this.updateCache(res);
                //         }
                //         return res;
                //     }
                // }
            },
            getByDate: {
                method: 'GET',
                url: '/ordersByDate',
                isArray: true,
                cache: false
                    // params:{
                    //     from: 'from',
                    //     to: 'to'
                    // },
            },
            getPicturesPath: {
                method: 'GET',
                url: '/orders/:id/pictures',
                isArray: true,
                cache: false,
                params: {
                    id: '@id'
                }
            },
            uploadPicture: {
                method: 'PUT',
                url: '/orders/:id/uploads',
                params: {
                    id: '@id'
                },
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: (data) => {
                    const formData = new FormData();
                    for(let prop in data){
                        formData.append(prop, data[prop]);
                    }
                    console.log(data);
                    return formData;
                }
            }

        });
        
        for(let prop in Orders){
            this[prop] = Orders[prop];
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
        // if(!order || !this.orders) { 
        //     return; 
        // }
        
        // let scheduleAt = this.SharedUtil._parseDate(order.scheduleAt);
        // if (this.orders[scheduleAt.toDateString()]) {}
        // // this.orders[scheduleAt.toDateString()][order._id] = this._setOrderType(order);
        // this.orders[scheduleAt.toDateString()][order._id] = order;
        // if(callback){
        //     return callback();
        // }
        // return;
    }
    
    _setOrderType(order) {
        if (order.isCanceled || order.notShowup || !order.checkInAt) {
            if (!order.isCanceled && !order.notShowup) { 
                return order.type='upcoming';
            }
            return order.type = null;
        }
        if (order.checkOutAt) { 
            return order.type = 'checkOutAt'; 
        } 
        if (order.inhouseOrders && 
            angular.isObject(order.inhouseOrders)) {
            if (Object.keys(order.inhouseOrders).length) {
                return order.type = 'processing';
            } else {
                return order.type = 'checkInAt';
            }
            
        }
        return order.type = 'checkInAt'
        
        // if (order.checkInAt) {
        //     if (order.checkOutAt) { 
        //         order.type = 'checkOutAt'; 
        //     } 
        //     else if (order.inhouseOrders && 
        //              angular.isArray(order.inhouseOrders) &&
        //              order.inhouseOrders.length) { 
        //         order.type = 'processing';
        //     }
        //     else { 
        //         order.type = 'checkInAt';
        //     }
        // } else {
        //     if (!order.isCanceled && !order.notShowup) { 
        //         order.type = 'upcoming';
        //     }
        //     else { order.type = null; }
        // }
    }
    
    
       /*
        what's the data structure here?
        
        
        It means you only query when getCache not found. no need to pull them all at once.
        ok ma?
        
        let me think....
        
        kk just alwasy start from your data structure first
        
        so in this way the cache will become bigger and bigger if i go very far on the offset?!
        
        correct, and you are saving server i/o as well
        
        oh cool! haven't thought of that....

        > but this is session-based, means it will be gone if you close tabs or refresh.
        > however, this cache way will be faster when you getCache after first time.
        > good luck ha
        
        yea.
        
        haha ok i'll have to do some baking now n comeback to this later!
        Also every new day(in the real world) will shift the offset, it might be possible that i jsut shift it, 
            instead of creating a new one?!
            
        > nah why? your 0 is always today.now ya.
        
        yeah i meant if i come back tomorrow, do i have to creat the structured data
            again?!
            
        > good idea, you can have a sm function to check isStillToday and shift the data structure.
        > however, they will shutdown the server everyday ha
        > they will have to bring the laptop home. 
        > I also have a windows serverive restart, they will have to do it everytime re-connect the printer.
        > you can still have that func implemented, it's a good idea. sure thing. 
        > kk back to work, pin me in `line`
    
    
        haha yeah... ok that would be a good practice ha
         OK! probably will be quite late 
         THX!!!
        {
            -3: [{order1}, {order2},...]
            -2: [{order1}, {order2},...]
            -1: [{order1}, {order2},...]
            0:
            +1:
            +2:
            +3:
        }
        getCache(offset){
            offset = offset || 0;
            if(this.orders[offset]){
                ...
                return this.orders[offset];
            } else {
                // query with offset
                this._getCache(offset).then((res)=>{
                    this.orders[offset] = res;
                    return this.orders[offset];
                });
                
                // put under to _getCache
                offset < 0 || offset > 0
                this.getByDate({last:, next:4}).$promise;
            }
        }
    
    
    */
    // _isStillToday() {
    //     if (this.orders && 
    //         this.orders.cacheCreatedAt.toDateString() != new Date().toDateString) {
    //             let cacheDate = this.SharedUtil._parseDate(this.orders.cacheCreatedAt);
    //             let today = this.SharedUtil._parseDate(new Date());
    //             // diff = cacheDate - today
    //             const diff = this.SharedUtil.daysBetween(cacheDate, today);
                
    //             const shiftedOrders = 
    //             Object.assign({}, ...Object.keys(this.orders).map((key)=>{
    //                 if (key !== 'cacheCreatedAt') {
    //                     let output = {};
    //                     output[Number(key) + diff] = this.orders[key];
    //                     return output;
    //                 }
    //             }));
    //             this.orders = shiftedOrders;
    //             this.orders.cacheCreatedAt = new Date();
    //         }
    // }
    
}


export default ordersService;
