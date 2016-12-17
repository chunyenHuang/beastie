import template from './Dashboard.html';
import './Dashboard.styl';
import Chart from 'chart.js';

const dashboardComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class DashboardController {
        static get $inject() {
            return [
                '$log',
                '$timeout',
                '$scope',
                '$state',
                '$stateParams',
                '$document',
                '$filter',
                'Transactions',
                'Settings',
                'SharedUtil',
                '$mdColors'
            ];
        }
        constructor(
            $log,
            $timeout,
            $scope,
            $state,
            $stateParams,
            $document,
            $filter,
            Transactions,
            Settings,
            SharedUtil,
            $mdColors
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$scope = $scope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$document = $document;
            this.$filter = $filter;
            this.Transactions = Transactions;
            this.Settings = Settings;
            this._parseDate = SharedUtil._parseDate;
            this._setDate = SharedUtil._setDate;
            this.$mdColors = $mdColors;
            
            
            // this.offsetFrom = -6;
            // this.offsetTo = 1;
            this.modes = ['day', 'last 7 days', 'month', 'year'];
            this.date = new Date();
            this.range = {};
            
            if (this.$stateParams && this.$stateParams.mode) {
                if (this.modes.indexOf(this.$stateParams.mode)) {
                    this.mode = this.$stateParams.mode;
                } else {
                    this.mode = 'day';
                }
            } else {
                this.mode = 'last 7 days';
            }
            
            this.subsetOne = ['total', 'cash', 'card'];
            this.subsetTwo = ['total', 'order', 'selfService', 'credit'];
            this.show = 'subsetOne';
            
            this.showRevenue = true;
        }
        
// today

// total / visits

// show number
// 1. total
// 2. w/ transac#
// 3. w/o transax#

// show lines

// lv0 date
// lv1 total/selfService/orders / ds....  >> parse (*_id) split('_id') customer_id
// lv2 counts    total   credit    cash   


// re-visit freq
        setRange(mode, date) {
            if (mode == 'day') {
                this.range.from = this._setDate(0, date);
                this.range.to = this._setDate(0, date);
            }
            if (mode == 'last 7 days') {
                this.range.from = this._setDate(-6, date);
                this.range.to = this._setDate(0, date);
            }
            if (mode == 'month') {
                if (date.getMonth() == new Date().getMonth() 
                    && date.getYear() == new Date().getYear()) {
                        this.range.from = this._setMonthStart(date);
                        this.range.to = this._setDate(0);
                } else {
                    this.range.from = this._setMonthStart(date);
                    this.range.to = this._setMonthEnd(date);
                }
            }
            if (mode == 'year') {
                this.range.from = this._setYear(-1, this._setDate(1, this._setMonthEnd(date)));
                this.range.to = this._setDate(0, this._setMonthEnd(date));
            }
        }
        _setMonthStart(date) {
            return new Date(new Date(date).setDate(1));
        }
        _setMonthEnd(date) {
            let d = new Date(date);
            return new Date(new Date(d.setMonth(d.getMonth() + 1)).setDate(0));
        }
        // _setDate(offset, date) {
        //     date = date || new Date();
        //     return new Date(new Date(date)
        //         .setDate(new Date(date).getDate() + offset));
        // }
        _setMonth(offset, date) {
            date = date || new Date();
            return new Date(new Date(date)
                .setMonth(new Date(date).getMonth() + offset));
        }
        _setYear(offset, date) {
            return new Date(new Date(date)
                .setFullYear(new Date(date).getFullYear() + offset));
        }
        setMode(mode) {
            this.mode = mode;
            this.$onInit();
        }
        _getSum(finalDataSets) {
            let dataForPlot = finalDataSets.map((array)=>{
                return array.reduce((a,b) => a+b, 0);
            });
            return dataForPlot.reduce((a,b) => a+b, 0);
        }
        _getCount(finalDataSets) {
            let dataForPlot = finalDataSets.map((array)=>{
                return array.length;
            });
            return dataForPlot.reduce((a,b) => a+b, 0);
        }
        changeTime(diff) {
            if (this.mode == 'day' || this.mode == 'last 7 days') {
                this.date = this._setDate(diff, this.date);
            }
            if (this.mode == 'month' || this.mode == 'year') {
                this.date = this._setMonth(diff, this.date);
            }
            this.$onInit();
        }
        toggleShowSubset(uiTrigger) {
            if(this.revenueChart && this.countChart) {
                if (uiTrigger)
                    this.show = this.show == 'subsetOne' ? 'subsetTwo' : 'subsetOne';
                
                let dataRevenue = [];
                for (let i=0; i<this.revenueDataset.length; i++) {
                    if (this[this.show].indexOf(this.revenueDataset[i].label) >= 0) 
                        dataRevenue.push(this.revenueDataset[i]);
                }
                this.revenueChart.data.datasets = dataRevenue;
                this.revenueChart.update();
                
                let dataCount = [];
                for (let i=0; i<this.countDataset.length; i++) {
                    if (this[this.show].indexOf(this.countDataset[i].label) >= 0) 
                        dataCount.push(this.countDataset[i]);
                }
                this.countChart.data.datasets = dataCount;
                this.countChart.update();
            }
        }
        setXLabel() {
            if (!this.Transactions.xAxisArr) return;
            if (this.mode == 'day') 
                return this.Transactions.xAxisArr;
            let dateFormat = '';
            if (this.mode == 'month') 
                dateFormat = 'EEE M/dd';
            if (this.mode == 'last 7 days')
                dateFormat = 'EEE M/dd';
            if (this.mode == 'year')
                dateFormat = 'MMM yyyy';
            let newXAxis = this.Transactions.xAxisArr.map((str)=>{
                return this.$filter('date')(new Date(str), dateFormat);
            })
            return newXAxis;
        }
        genLabel(str) {
            if (!str) return;
            return str.split('_id')[0];
        }
        $onInit(){
            Chart.defaults.global.defaultFontColor = this.$mdColors.getThemeColor('default-primary');
            Chart.defaults.global.defaultFontSize = 16;
            Chart.defaults.global.elements.point = {
                radius: 5,
                pointStyle: 'circle',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.1)',
                hitRadius: 7, 
                hoverRadius: 7,
                hoverBorderWidth: 1,
            }
            
            var revenueChartEl = document.getElementById("revenueChart");
            var countChartEl = document.getElementById("countChart");
            
            if (this.revenueChart) {
                if(this.revenueChart !== undefined || this.revenueChart !== null) {
                    this.revenueChart.destroy();
                }
            }
            if (this.countChart) {
                if(this.countChart !== undefined || this.countChart !== null) {
                    this.countChart.destroy();
                }
            }
            
            this.setRange(this.mode, this.date);
            this.calOpen = false;
            console.log(this.range);
            
            Promise.all([
                this.Transactions.findStoreOpenDays(this.range), 
                this.Transactions.init(this.range, this.mode)
            ])
            // this.Transactions.init(this.range, this.mode)
            .catch(()=>{
                console.log('no data!');
                return;
            }).then(()=>{
                // the following code runs even the promise is rejected...
                if (!this.Transactions.datas) return;
                
                // this.countOpenDaysInRange();
                
                let counter = 0;
                let revenueDataset = [];
                let countDataset = [];
                angular.forEach(this.Transactions.finalDataSets, (val, key)=>{
                    let colors = ['red', 'deep-purple', 'light-blue', 'green', 'amber', 'blue-grey', 'brown', 'blue-grey'];
                    let pointStyles = ['circle', 'triangle', 'rect', 'rectRot', 'cross', 'crossRot', 'star', 'line', 'dash'];
                    let data = {
                        label: this.genLabel(key),
                        backgroundColor: this.$mdColors.getThemeColor(colors[counter]+'-500-0.6'),
                        borderColor: this.$mdColors.getThemeColor(colors[counter]+'-500-1'),
                        pointStyle: pointStyles[counter],
                        fill: false,
                        lineTension: 0,
                        borderCapStyle: 'butt',
                        spanGaps: false
                    }
                    let revenueData = val.map((array)=>{
                        return array.reduce((a,b) => a+b, 0);
                    });
                    let countData = val.map((array) => array.length);
                    
                    countDataset.push(Object.assign({}, data, {data: countData}));
                    revenueDataset.push(Object.assign({}, data, {data: revenueData}));
                    
                    counter ++;
                });
                this.revenueDataset = revenueDataset;
                this.countDataset = countDataset;
                
                this.revenueChart = new Chart(revenueChartEl, {
                    type: 'line',
                    options: {
                        // responsive: false,
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                padding:16
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                },
                                scaleLabel: {
                                    labelString: 'Revenue (dollor)',
                                    display: true,
                                }
                            }],
                            
                        }
                    },
                    data: {
                        labels: this.setXLabel(),
                        // datasets: revenueDataset,
                    },
                
                });
            
                this.countChart = new Chart(countChartEl, {
                    type: 'bar',
                    options: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: false,
                                boxWidth: 16,
                                padding:16
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                },
                                scaleLabel: {
                                    labelString: 'Occurance (count)',
                                    display: true,
                                }
                            }]
                        }
                    },
                    data: {
                        labels: this.setXLabel(),
                        // datasets: countDataset,
                    }
                });
                this.toggleShowSubset();
            });
        }
        
    }
};
export default dashboardComponent;
