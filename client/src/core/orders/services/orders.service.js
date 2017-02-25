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
                transformResponse: (res) => {
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
                            this.updateCache(res, () => {
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
            }
        });

        for (let prop in Orders) {
            this[prop] = Orders[prop];
        }
        console.log(this)
    }

    _getCache(date) {
        date = date || new Date();
        return this.getByDate({
            date: date
        }).$promise;
    }

    getCache(date) {
        date = date || new Date();
        const dateStr = date.toDateString();
        return new Promise((resolve) => {
            if (this.orders && this.orders[dateStr]) {
                resolve(this.orders[dateStr])
            } else {
                this.orders = this.orders || {};
                this._getCache(date).then((res) => {
                    let objFromArr =
                        Object.assign({}, ...res.map((el) => {
                            let output = {};
                            output[el._id] = el;
                            return output;
                        }))
                    angular.forEach(objFromArr, (obj) => {
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
    updateCache(order, callback) {
        if (!order) {
            return;
        } else {
            this.get({
                id: order._id
            }).$promise.then((res) => {
                order = res;
                let scheduleAt = this.SharedUtil._parseDate(order.scheduleAt);
                if (this.orders && this.orders[scheduleAt.toDateString()]) {
                    this._setOrderType(order);
                    this.orders[scheduleAt.toDateString()][order._id] = order;
                    if (callback) {
                        return callback();
                    }
                }
                if (callback) {
                    return callback();
                }
                return;
            });
        }
    }

    _setOrderType(order) {
        if (order.isCanceled || order.notShowup || !order.checkInAt) {
            if (!order.isCanceled && !order.notShowup) {
                return order.type = 'upcoming';
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
        return order.type = 'checkInAt';
    }
}

export default ordersService;