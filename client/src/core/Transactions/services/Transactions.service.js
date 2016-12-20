/* @ngInject */
class transactionsService {
    static get $inject() {
        return ['$resource', 'SharedUtil', '$filter', 'Settings'];
    }
    constructor($resource, SharedUtil, $filter, Settings) {
        this.SharedUtil = SharedUtil;
        this.$filter = $filter;
        this.Settings = Settings;
        this._setDate = SharedUtil._setDate;
        this._parseDate = SharedUtil._parseDate;

        const Transactions = $resource('/transactions/:id', {
            id: '@id'
        }, {
            checkout: {
                method: 'POST',
                url: '/transactions',
                transformRequest: (data)=>{
                    // console.warn(data);
                    return angular.toJson(data);
                }
            },
            void: {
                method: 'PUT',
                url: '/transactions/:id/void',
                parmas: {
                    id: '@id'
                }
            },
            // update: {
            //     method: 'PUT',
            //     url: '/transactions/:id/update',
            //     parmas: {
            //         id: '@id'
            //     }
            // },
            delete: {
                method: 'DELETE',
                url: '/transactions/:id',
                parmas: {
                    id: '@id'
                }
            }
        });

        for (let prop in Transactions) {
            this[prop] = Transactions[prop];
        }
        this.DataSets = {};
    }
    
    getCache(){
        return new Promise((resolve)=>{
            if(this.datas){
                resolve(this.datas);
            }
            this.query().$promise.then((res)=>{
                this.datas = res;
                resolve(this.datas);
            });
        });
    }
    
    init(range, mode, callback){
        return new Promise((resolve, reject)=>{
            this.query({
                dateField: 'createdAt',
                from: range.from,
                to: new Date(new Date(range.to).setDate(new Date(range.to).getDate()+1))
            }).$promise.then((res)=>{
                // console.info(res);
                this.datas = res;
                
                this.genXAxisArr(range, mode, ()=>{
                    this.genEmptyDataSets(()=>{
                        this.assignDataIntoDataSets(mode, ()=>{
                            this.toFinalDataSets();
                            if(callback) callback();
                            resolve();
                        });
                    });
                });
            }, ()=>{
                this.datas = null;
                this.finalDataSets = null;
                reject();
            });
        });
    }
    findStoreOpenDays(range) {
        return new Promise((resolve, reject)=>{
            this.getOfficeHours(()=>{
                this.genOpenDaysArr(()=>{
                    this.countOpenDaysInRange(range);
                    resolve();
                });
            });
        });
    }
    genOpenDaysArr(callback) {
        this.openDaysArr = [];
        angular.forEach(this.officeHours, (value, key)=>{
            if (value.to-value.from !== 0) {
                this.openDaysArr.push(value.id);
            }
        });
        if (callback) callback();
    }
    getOfficeHours(callback) {
        if (this.officeHours) {
            if (callback) callback();
        }
        if (!this.officeHours) {
            this.Settings.query({
                type: 'officeHours'
            }).$promise.then((res)=>{
                this.officeHours = res[0].officeHours;
                if (callback) callback();
            });
        }
    }
    countOpenDaysInRange(range) {
        this.openDays = 0;
        let diff = this._parseDate(this._setDate(1, range.to)) - 
            this._parseDate(range.from);
        const dInMilisec = 86400000;
        this.openDays = this.openDays + 
            Math.floor(Math.round(diff / dInMilisec) / 7) * (this.openDaysArr.length);
        let remainder = Math.round(diff / dInMilisec) % 7;
        let remainderDaysArr = Array(remainder).fill(range.from.getDay())
            .map((value, index)=>value+index);
        for (let i=0; i<remainderDaysArr.length; i++) {
            if (this.openDaysArr.indexOf(remainderDaysArr[i]) > -1) {
                this.openDays++;
            }
        }
        console.info(this.openDays);
    }
    
    genXAxisArr(range, mode, callback) {
        if (mode && mode != 'day' && mode != 'year') {
            this.xAxisArr = this._genDayArr(range.from, range.to);
            if(callback) callback();
        }
        if (mode == 'day') {
            let dayToday = this.$filter('date')(range.from, 'EEEE');
            this.Settings.query({
                type:"officeHours"
            }).$promise.then((res)=>{
                let officeHours = res[0].officeHours;
                let hourToday = officeHours[dayToday];
                this.xAxisArr = this._genHourArr(hourToday.from, hourToday.to + 1);
                if(callback) callback();
            });
        } 
        if (mode == 'year') {
            this.xAxisArr = this._genMonthArr(range.from, range.to);
            if(callback) callback();
        }
        // console.warn(this.xAxisArr);
    }
    _genDayArr(from, to) {
        let dFirst = new Date(from);
        // let dLast = new Date(to);
        let dLast = new Date(new Date(to).setDate(new Date(to).getDate()-0));
        let dayArr = [];
        if (dFirst.valueOf() > dLast.valueOf()) return;
        if (dFirst.toDateString() == dLast.toDateString()) return [dFirst.toDateString()];
        
        dayArr.push(dFirst.toDateString());
        while (dFirst.toDateString() != dLast.toDateString()) {
            dFirst = new Date(dFirst.setDate(dFirst.getDate() + 1));
            dayArr.push(dFirst.toDateString());
        }
        return dayArr;
    }
    _genHourArr(from, to) {
        if (!to) {
            return;
        }
        if (to <= from) {
            return;
        }
        return Array(to-from).fill(from).map((value, index)=>value+index);
    }
    _genMonthArr(from, to) {
        let mFirst = new Date(new Date(from).setDate(1));
        let mLast = new Date(new Date(to).setDate(1));
        let monthArr = [];
        if (mFirst.valueOf() > mLast.valueOf()) return;
        if (mFirst.toDateString() == mLast.toDateString()) return [mFirst.toDateString()];
        
        monthArr.push(mFirst.toDateString());
        while (mFirst.toDateString() != mLast.toDateString()) {
            mFirst = new Date(mFirst.setMonth(mFirst.getMonth() + 1));
            monthArr.push(mFirst.toDateString());
        }
        return monthArr;
    }
    
    genEmptyDataSets(callback) {
        let typesInDataSets = { total:[], cash:[], card:[] };
        angular.forEach(this.datas[0], (value, key) => {
            let splittedKey = key.split('_id');
            if (splittedKey.length > 1 && splittedKey[0]) {
                typesInDataSets[key] = [];
            }
        });
        this.DataSets = this.xAxisArr.map(()=>angular.copy(typesInDataSets));
        // console.log(this.DataSets);
        if(callback) {callback()}
    }
    
    assignDataIntoDataSets(mode, callback) {
        angular.forEach(this.datas, (val) => {
            let index;
            if (mode && mode != 'day' && mode !='year') {
                index = this.xAxisArr.indexOf(new Date(val.createdAt).toDateString());
            }
            if (mode == 'day') {
                index = this.xAxisArr.indexOf(Number(this._toHour(val.createdAt)));
            } 
            if (mode == 'year') {
                index = this.xAxisArr.indexOf(new Date(new Date(val.createdAt).setDate(1)).toDateString());
            }
            // let index = this.officeHourArr.indexOf(Number(this._toHour(val.createdAt)));
            
            let total = Number(val.total);
            let position = this.DataSets[index];
            // console.warn(index);
            // console.warn(position);
            position.total.push(total);
            val.paymentTransactionsNumber ? position.card.push(total) : position.cash.push(total);
            Object.keys(this.DataSets[0]).map((name) => {
                if (name != 'total' && name != 'card' && name != 'cash') {
                    val[name] ? position[name].push(total) : null;
                }
            });
        });
        // console.log(this.DataSets);
        if (callback) {callback()};
    }
    
    toFinalDataSets() {
        this.finalDataSets = {};
        Object.keys(this.DataSets[0]).map((name) => {
            this.finalDataSets[name] = [];
        });
        this.DataSets.map((obj)=>{
            // {total: [...], card: [...], cash: [...]}
            angular.forEach(obj, (value, key) =>{
               this.finalDataSets[key].push(value); 
            });
        });
        // const totals = this.finalDataSets.total.map((array) => {
        //     return array.reduce((a,b)=> a+b,0);
        // });
        // console.log(totals);
        // console.log(this.finalDataSets);
    }
    
    _toHour(str) {
        return this.$filter('date')(new Date(str), 'H')
    }
    
    sumTotalEveryHour(callback) {
        this.totalEveryHour = Array(this.officeHourArr.length).fill(0);
        angular.forEach(this.datas, (value)=>{
            let index = this.officeHourArr.indexOf(Number(this._toHour(value.createdAt)));
            this.totalEveryHour[index] += value.total;
            
        });
        if(callback){callback()};
    }
    
}

export default transactionsService;
