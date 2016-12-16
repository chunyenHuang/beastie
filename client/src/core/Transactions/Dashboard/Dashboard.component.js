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
        _setDate(offset, date) {
            date = date || new Date();
            return new Date(new Date(date)
                .setDate(new Date(date).getDate() + offset));
        }
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
        test() {
            if (this.myChart) {
                console.log(this.myChart.data.datasets);
                this.myChart.data.datasets.pop();
                this.myChart.update();
            }
        }
        setXLabel() {
            if (!this.Transactions.xAxisArr) return;
            if (this.mode == 'day') 
                return this.Transactions.xAxisArr;
            let dateFormat = '';
            if (this.mode == 'month') 
                dateFormat = 'shortDate';
            if (this.mode == 'last 7 days')
                dateFormat = 'EEE M/dd';
            if (this.mode == 'year')
                dateFormat = 'MMM yyyy';
            let newXAxis = this.Transactions.xAxisArr.map((str)=>{
                return this.$filter('date')(new Date(str), dateFormat);
            })
            return newXAxis;
        }
        $onInit(){
            Chart.defaults.global.defaultFontColor = this.$mdColors.getThemeColor('default-primary');
            Chart.defaults.global.defaultFontSize = 16;
            Chart.defaults.global.elements.point = {
                radius: 5,
                pointStyle: 'circle',
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.1)',
                hitRadius: 7, 
                hoverRadius: 7,
                hoverBorderWidth: 2,
            }
            
            this.calOpen = false;
            if (this.myChart) {
                if(this.myChart !== undefined || this.myChart !== null) {
                    this.myChart.destroy();
                }
            }
            
            this.setRange(this.mode, this.date);
            console.log(this.range);
            
            this.Transactions.init(this.range, this.mode).then(()=>{
                if (!this.Transactions.datas) {
                    console.log('no data!');
                    new Chart(ctx, {});
                    return;
                }
                
                console.log(this._getSum(this.Transactions.finalDataSets.total));
                console.log(this._getSum(this.Transactions.finalDataSets.card));
                console.log(this._getSum(this.Transactions.finalDataSets.cash));
                
                let counter = 0;
                let dataset = [];
                angular.forEach(this.Transactions.finalDataSets, (val, key)=>{
                    let colors = ['red', 'deep-purple', 'light-blue', 'green', 'amber', 'blue-grey', 'brown', 'blue-grey'];
                    let pointStyles = ['circle', 'triangle', 'rect', 'rectRot', 'cross', 'crossRot', 'star', 'line', 'dash'];
                    let data = {
                        label: key + ' ($)',
                        backgroundColor: this.$mdColors.getThemeColor(colors[counter]+'-500-0.6'),
                        borderColor: this.$mdColors.getThemeColor(colors[counter]+'-500-1'),
                        pointStyle: pointStyles[counter],
                        data: val.map((array)=>{
                            return array.reduce((a,b) => a+b, 0);
                        }),
                        fill: false,
                        lineTension: 0,
                        borderCapStyle: 'butt',
                        spanGaps: false
                    }
                    dataset.push(data);
                    counter ++;
                });
                
                
                this.myChart = new Chart(ctx, {
                type: 'line',
                options: {
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
                            }
                        }]
                    }
                },
                data: {
                    labels: this.setXLabel(),
                    datasets: dataset,
                    // datasets: [
                    //     {
                    //         label: "My First dataset",
                    //         fill: false,
                    //         lineTension: 0.1,
                    //         backgroundColor: "rgba(75,192,192,0.4)",
                    //         borderColor: "rgba(75,192,192,1)",
                    //         borderCapStyle: 'butt',
                    //         borderDash: [],
                    //         borderDashOffset: 0.0,
                    //         borderJoinStyle: 'miter',
                    //         // pointBorderColor: "rgba(75,192,192,1)",
                    //         // pointBackgroundColor: "#fff",
                    //         // pointBorderWidth: 5,
                    //         // pointHoverRadius: 5,
                    //         // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    //         // pointHoverBorderColor: "rgba(220,220,220,1)",
                    //         // pointHoverBorderWidth: 2,
                    //         // pointRadius: 1,
                    //         // pointHitRadius: 10,
                    //         pointStyle: 'triangle',
                    //         data: this.Transactions.finalDataSets.total.map((array) => {
                    //             return array.reduce((a,b) => a+b, 0);
                    //         }),
                    //         spanGaps: true,
                    //     },
                    //     {
                    //         label: "My First dataset",
                    //         fill: false,
                    //         lineTension: 0.1,
                    //         backgroundColor: "rgba(75,192,192,0.4)",
                    //         // borderColor: "rgba(75,192,192,1)",
                    //         borderCapStyle: 'butt',
                    //         borderDash: [],
                    //         borderDashOffset: 0.0,
                    //         borderJoinStyle: 'miter',
                    //         // pointBorderColor: "rgba(75,192,192,1)",
                    //         pointBackgroundColor: "#fff",
                    //         pointBorderWidth: 1,
                    //         pointHoverRadius: 5,
                    //         // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    //         // pointHoverBorderColor: "rgba(220,220,220,1)",
                    //         pointHoverBorderWidth: 2,
                    //         pointRadius: 1,
                    //         pointHitRadius: 10,
                    //         data: this.Transactions.finalDataSets.card.map((array) => {
                    //             return array.reduce((a,b) => a+b, 0);
                    //         }),
                    //         spanGaps: false,
                    //     },
                    //     {
                    //         label: "My First dataset",
                    //         fill: false,
                    //         lineTension: 0.1,
                    //         // backgroundColor: "rgba(75,192,192,0.4)",
                    //         // borderColor: "rgba(75,192,192,1)",
                    //         borderCapStyle: 'butt',
                    //         borderDash: [],
                    //         borderDashOffset: 0.0,
                    //         borderJoinStyle: 'miter',
                    //         // pointBorderColor: "rgba(75,192,192,1)",
                    //         // pointBackgroundColor: "#fff",
                    //         pointBorderWidth: 1,
                    //         pointHoverRadius: 5,
                    //         // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    //         // pointHoverBorderColor: "rgba(220,220,220,1)",
                    //         pointHoverBorderWidth: 2,
                    //         pointRadius: 1,
                    //         pointHitRadius: 10,
                    //         data: this.Transactions.finalDataSets.cash.map((array) => {
                    //             return array.reduce((a,b) => a+b, 0);
                    //         }),
                    //         spanGaps: false,
                    //     },
                    //     // {
                    //     //     label: "My Second dataset",
                    //     //     fill: false,
                    //     //     lineTension: 0.1,
                    //     //     backgroundColor: "rgba(75,192,192,0.4)",
                    //     //     borderColor: "rgba(0, 0, 0,1)",
                    //     //     borderCapStyle: 'butt',
                    //     //     borderDash: [],
                    //     //     borderDashOffset: 0.0,
                    //     //     borderJoinStyle: 'miter',
                    //     //     pointBorderColor: "rgba(75,192,192,1)",
                    //     //     pointBackgroundColor: "#fff",
                    //     //     pointBorderWidth: 1,
                    //     //     pointHoverRadius: 5,
                    //     //     pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    //     //     pointHoverBorderColor: "rgba(220,220,220,1)",
                    //     //     pointHoverBorderWidth: 2,
                    //     //     pointRadius: 1,
                    //     //     pointHitRadius: 10,
                    //     //     data: [40, 40, 40, 40, 40, 40, 40],
                    //     //     spanGaps: false,
                    //     // }
                    // ]
                },
                
            });
            });
            
            var ctx = document.getElementById("myChart");
            
        }
        
    }
};
export default dashboardComponent;
