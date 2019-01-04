<template>
<div class="risk-performance-wrapper" @scroll="handleScroll">
    <div class="risk-performance">

        <div class="static-quota">
            <div class="static-quota__header nav-header">关键静态指标展示</div>
            <div class="static-quota-content">
                <table>
                    <tr><td class="thead" v-for="item in staticQuotaKeys1">{{staticQuotaNames[item]}}</td></tr>
                    <tr><td v-for="item in staticQuotaKeys1">{{staticQuotaVals[item]}}</td></tr>
                </table>
                <table>
                    <tr><td class="thead" v-for="item in staticQuotaKeys2">{{staticQuotaNames[item]}}</td></tr>
                    <tr><td v-for="item in staticQuotaKeys2">{{staticQuotaVals[item]}}</td></tr>
                </table>
                <div class="report-info">{{}}</div>
            </div>
        </div>

        <div class="charts-wrapper">
            <div class="chart-header nav-header"
                  v-for="(item,index) in sortedChartData"
                  :style="{top:oneChartWrapperHeight*index+'px'}">
                {{item.title}}
            </div>

           <div  class="report-info report-info-abs"
                 v-for="item in chartData"
                 :style="{top:(oneChartWrapperHeight*item.order + reportInfoTop) + 'px',left:chartGridLeft+'px',width:chartWidth + 'px'}">
               <div class="report-info-icon"><Icon type="md-arrow-dropup" /></div>
               <div class="report-info-text" >{{item.reportInfo}}</div>
           </div>

            <div class="chart" id="chartRiskPerformance"></div>
        </div>
    </div>
</div>
</template>

<script>

import  report from '@/libs/fundReport.js'
import {
	getKeyStaticQuotas,
	getNavAndBenchAndDrawDown,
	getUplinkMonthReturns,
	getDownlinkMonthReturns,
    getRollingReturnsAndVolatility,
    getSharpRatioAndSortinoRatio
    } from '@/api/fundview'

export default {

	props:{ },

	data()
    {
    	return {
            //关键静态指标
    		staticQuotaKeys1:[
    			'productName','annualYield','annualVolatility','sharpRatio','informationRatio','sortinoRatio','maxDrawdown','dateMaxDrawdown',
                'uplinkOdds','uplinkEarnProb','downlinkOdds','downlinkEarnProb','bestMonthReturn','worstMonthReturn','extremeRatioByDay'
            ],
		    staticQuotaKeys2:[
			    'productName','topDayGain','topDayLoss','skewness','kurtosis','var95Percent','alpha','beta','rsquare',
                'weekEarn','weekMaxDrawdown','monthEarn','monthMaxDrawdown','yearEarn','yearMaxDrawdown'
            ],
		    staticQuotaNames: {
	            productName: "基金简称",
			    annualYield: "年化收益率",
			    annualVolatility: "年化波动率",
                latelyNetPrice: "最新净值",
                accumEarn: "累计收益",
                yieldOfThisYear: "今年以来收益",
                dateEstablish: "成立日期",
                skewness: "偏度",
                kurtosis: "峰度",
                sharpRatio: "夏普比率",
                informationRatio: "信息比率",
                sortinoRatio: "所提诺比率",
                maxDrawdown: "最大回撤",
                dateMaxDrawdown: "最大回撤日期",
                bestMonthReturn: "最好月份回报",
                worstMonthReturn: "最差月份回报",
                topDayGain: "最大单日涨幅",
			    topDayLoss: "最大单日跌幅",
			    extremeRatioByDay: "创新高天数占比",
			    var95Percent: "Var(95%)",
			    alpha: "Alpha",
			    beta: "Beta",
			    rsquare: "R²",
			    weekEarn: "本周收益",
			    weekMaxDrawdown: "本周最大回撤",
			    monthEarn: "本月收益",
			    monthMaxDrawdown: "本月最大回撤",
			    yearEarn: "本年收益",
			    yearMaxDrawdown: "本年最大回撤",
			    uplinkOdds: "上行胜率",
			    uplinkEarnProb: "上行赢率概率",
			    downlinkOdds: "下行胜率",
			    downlinkEarnProb: "下行盈利概率"
            },
		    staticQuotaVals:{},  //关键静态指标对象 {'productName':'景富趋势成长六期证券投资基金','annualYield':'0.0180',……}


            //原始数据
            chartData:
            {
                nav: {order: 0, type:'line', seriesNames: ['净值', '基准'], title: '净值展示'},
	            uplinkMonth: {order: 1, type:'bar',  seriesNames: ['上行月度收益', '基准'], title: '上行月度收益'},
	            downlinkMonth: {order: 2, type:'bar',  seriesNames: ['下行月度收益', '基准'], title: '下行月度收益'},
	            drawDown: {order: 3,type:'line',  seriesNames: ['滚动回撤', '基准'], title: '滚动回撤'},
	            returnsAndVolatitly: {order: 4, type:'line', isDoubleY:true, seriesNames: ['收益率', '波动率'], title: '20期滚动收益率和波动率'},
	            sharpAndSortino: {order: 5, type:'line',  seriesNames: ['夏普比率', '索提诺比率'], title: '20期滚动夏普比率和索提诺比率'}
            },
            sortedChartData:[], //按照chartData中的order进行排序过的数据

		    chartWidth:1000, //图表实际宽度=grid+lenged=chartWrapper-gridleft-legendMarginRight
            chartLegendWidth: 200,
    		chartComponentHeights:{header: 50, main: 350, bottom:180, mainToReport:80 },   //图表的各部分高度值
            oneChartWrapperHeight: 0,   //一个图表的高度
		    chartGridLeft: 75,
		    chartGridRight: 30,
		    reportInfoTop: 0,

    		chart: null,
            chartOptions:
            {
            	//title:{show:false},
    			grid:
                [
                   /* {left: 80,  top: 50, height: 400,width: '70%'},
	                {left: 80,  top: 580, height: 400, width: '70%'}  */
                ],

	            xAxis:
                [
                	/*{ gridIndex: 0, type: "category", data: [] },
	                { gridIndex: 1, type: "category", data: [] },
	                { gridIndex: 2, type: "category", data: [] },
	                { gridIndex: 3, type: "category", data: [] },
	                { gridIndex: 4, type: "category", data: [] },*/
	            ],

	            yAxis:
                [
		  /*         //净值
		           {
		            	gridIndex: 0,
			            type: "value",
			            min: 'dataMin'
		            },

                    //上行月度
	                {
		                gridIndex: 1,
		                type: "value",
		                min: 'dataMin'
	                },

                    //下行月度
	                {
		                gridIndex: 2,
		                type: "value",
		                min: 'dataMin'
	                },

                    //回撤
	                {
		                gridIndex: 3,
		                type: "value",
		                min: 'dataMin'
	                },

                    {
                    	gridIndex: 4,
                        type: "value",
	                    name: '收益率',
	                    nameLocation: 'middle',
	                    nameGap: 30,
	                    nameRotate: 45,
                    },
	                {
		                gridIndex: 4,
		                type: "value",
		                name: '波动率',
		                nameLocation: 'middle',
		                nameGap: 30,
		                nameRotate: 45
	                },

                    //夏普比率和索提诺比率
	                {
                        gridIndex: 5,
                        type: "value",
                        min: 'dataMin'
                    },*/

	            ],

	            series:
                [/*
		           {
			            name: "净值",
			            type: "line",
			            symbol: "none"
		            },
		            {
			            name: "基准",
			            type: "line",
			            symbol: "none"
		            },

	                {
		                name: "上行月度收益",
		                type: "bar",
		                symbol: "none"
	                },
	                {
		                name: "基准",
		                type: "bar",
		                symbol: "none"
	                },

	                {
		                name: "下行月度收益",
		                type: "bar",
		                symbol: "none"
	                },
	                {
		                name: "基准",
		                type: "bar",
		                symbol: "none"
	                },

                    {
                        name: "回撤",
                        type: "bar",
                        symbol: "none"
                    },
                    {
                        name: "基准",
                        type: "bar",
                        symbol: "none"
                    },

	                {
		                name: "滚动收益率",
		                type: "line",
		                xAxisIndex: 1,
		                yAxisIndex: 2,
		                symbol: "none",
		                data: []
	                },
	                {
		                name: "波动率",
		                type: "line",
		                xAxisIndex: 1,
		                yAxisIndex: 3,
		                symbol: "none",
		                data: []
	                },

	                {
		                name: "夏普比率",
		                type: "line",
		                xAxisIndex: 2,
		                yAxisIndex: 4,
		                symbol: "none",
		                data: []
	                },
	                {
		                name: "索提诺比率",
		                type: "line",
		                xAxisIndex: 2,
		                yAxisIndex: 5,
		                symbol: "none",
		                data: []
	                }
	                */
	            ],

	            legend:
		            [/*
			           {
				            data: ["净值", "基准"],
				            orient: 'vertical',
				            right: '15%',
				            top: '10%'
			            },
			            {
				            data: ["上行月度收益", "基准"],
				            orient:'vertical',
				            right:'15%',
				            top:'30%'
			            },
			            {
				            data: ["下行月度收益", "基准"],
				            orient:'vertical',
				            right:'15%',
				            top:'30%'
			            },
			            {
				            data: ["回撤", "基准"],
				            orient:'vertical',
				            right:'15%',
				            top:'30%'
			            },
			            {
				            data: ["滚动收益率", "波动率"],
				            orient:'vertical',
				            right:'15%',
				            top:'30%'
			            },
			            {
				            data: ["夏普比率", "索提诺比率"],
				            orient:'vertical',
				            right:'15%',
				            top:'50%'
			            }
*/
		            ],

                dataZoom:[
	                /*{type:'slider', start: 0, end: 30, xAxisIndex:[0], top: 480},
	                {type:'slider', start: 0, end: 30, xAxisIndex:[1], top: 1010},
	                */
                ],

	            tooltip: { trigger: "axis"},

            },

		    //图表是否已创建
		    isCreatedShart:
            {
                uplinkMonthReturn: false,
                downlinkMonthReturn: false,
                drawDown: false,
                returnsAndVolatility: false,
	            sharpAndSortino:false
            },
            fundType: '',
            fundCode: ''
        }
    },

	methods:
    {

    	//获取当前基金和基准指数的关键静态指标
	    getKeyStaticQuotasOfFundAndBench()
        {
	        getKeyStaticQuotas(this.fundType, this.fundCode)
            .then( res =>
            {
	            let resData = res.data;
                if(resData.items.length > 0)
                {
                	this.staticQuotaVals = resData.items[0];
                }
            })
        },


    	// 图表的配置数据进行排序
    	sortChartData()
        {
        	for(let key in this.chartData)
            {
            	this.sortedChartData.splice(this.chartData[key].order, 0, this.chartData[key]);
            }
            console.log('sortedChartData',this.sortedChartData)
        },


        adjustWidthHeight(action)
        {
	        let chartWrapperWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector('.charts-wrapper')).width);
	        console.log('chartWrapperWidth',chartWrapperWidth);
	        this.chartWidth = chartWrapperWidth - this.chartGridLeft - this.chartGridRight;
	        let gridWidth = this.chartWidth - this.chartLegendWidth;
	        let heights = this.chartComponentHeights;
	        let oneChartHeight = heights.header + heights.main + heights.marginBottom;

	        this.chartOptions.grid = [];
	        for(let i = 0; i < this.sortedChartData.length; i++)
	        {
		        let gridTop = oneChartHeight * i + heights.header;
		        let gridHeight = heights.main;
		        this.chartOptions.grid.push({
			        left: this.chartGridLeft,
			        width: gridWidth,
			        top: gridTop,
			        height: gridHeight
		        });
	        }
	        if(action)
            {
	            this.chart.setOption(this.chartOptions);
            }


        },

    	//图标参数配置初始化：主要是设置top进行定位
    	initChartOptions()
        {
        	let chartColorTarget = '#c23531', chartColorBench = '#2f4554';
        	//this.adjustWidthHeight();
           	let parentPageStyle = document.defaultView.getComputedStyle(document.querySelector('.fund-content'));
           	let parentElementStyle = document.defaultView.getComputedStyle(document.querySelector('.fund-content-tabs'));
           	console.log('fund-content width,',parentPageStyle.width);
           	let chartWrapperWidth;
	        chartWrapperWidth = parseInt(parentPageStyle.width) - 2
                - parseInt(parentPageStyle.paddingLeft) - parseInt(parentPageStyle.paddingRight)
                - parseInt(parentElementStyle.paddingLeft) - parseInt(parentElementStyle.paddingRight);
        	console.log('chartWrapperWidth',chartWrapperWidth);

        	this.chartWidth = chartWrapperWidth - this.chartGridLeft - this.chartGridRight;  //grid+legend
        	let gridWidth = this.chartWidth - this.chartLegendWidth;
        	let heights = this.chartComponentHeights;
        	let oneChartHeight = heights.header + heights.main + heights.bottom;
	        this.reportInfoTop = heights.header + heights.main + heights.mainToReport;
	        console.log('gridWidth,',gridWidth);
	        let yAxisItem =
            {
	           // gridIndex: 0,
                type: "value",
                min: 'dataMin',
            };

	        let seriesItem =
            {
		        name: "净值",
		        type: "line",
		        xAxisIndex: 0,
		        yAxisIndex: 0,
		        symbol: "none",
	            itemStyle: {normal:{color:'#f00'}}
	        };

	        let legendItem =
                {
	                //borderWidth:1,
	                orient:'vertical',
	                //right:40,
                    left:(gridWidth + 120),
                    width: 150
                };

	        let yAxisIndex = 0;
            let chartData = this.sortedChartData;

	        this.oneChartWrapperHeight = oneChartHeight;

        	//设置每个grid的top/height
            for(let i = 0; i < this.sortedChartData.length; i++)
            {
            	let gridTop =  oneChartHeight * i + heights.header;
                let gridHeight = heights.main;
	            this.chartOptions.grid.push({left: this.chartGridLeft, width: gridWidth, top: gridTop, height: gridHeight});
	            this.chartOptions.xAxis.push({ gridIndex: i, type: "category", data: [] }); //, splitArea: {show: true}

	            this.chartOptions.yAxis.push({...yAxisItem, gridIndex: i});
	            if(chartData[i].isDoubleY)
                {
	                this.chartOptions.yAxis.push({...yAxisItem, gridIndex: i});
                }

	            seriesItem.type = chartData[i].type;
                if(i == (this.chartData.drawDown.order))
                {
	                this.chartOptions.series.push({
		                ...seriesItem,
		                name:chartData[i].seriesNames[0],
		                xAxisIndex: i,
		                yAxisIndex: yAxisIndex,
		                data:[],
		                itemStyle: {normal:{color:chartColorTarget}},
		                tooltip:{trigger: "axis"},
		                smooth:true,
		                areaStyle:
                        {
		                	normal:
                            {
                            	color:
                                {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'red'}, // 0% 处的颜色
                                        {offset: 1, color: 'blue'} // 100% 处的颜色
                                    ],
                                    globalCoord: false // 缺省为 false
                                }
                            }
                        }
	                });
                }
                else
                {
	                this.chartOptions.series.push({
		                ...seriesItem,
		                name:chartData[i].seriesNames[0],
		                xAxisIndex: i,
		                yAxisIndex: yAxisIndex,
		                data:[],
		                itemStyle: {normal:{color:chartColorTarget}},
		                tooltip:{trigger: "axis"}

	                });
                }


	            if(chartData[i].isDoubleY)
                {
	                ++yAxisIndex;
                }
	            this.chartOptions.series.push({
                    ...seriesItem,
                    name:chartData[i].seriesNames[1],
                    xAxisIndex: i,
                    yAxisIndex: yAxisIndex++,
                    data:[],
		            itemStyle: {normal:{color:chartColorBench}},
                    tooltip:{trigger: "axis"}
	            });

                let dataZoomTop = this.oneChartWrapperHeight * (i+1) - 145;
	            this.chartOptions.dataZoom.push({type:'slider', start: 0, end: 30, xAxisIndex:[i], top: dataZoomTop});

	            this.chartOptions.legend.push({
                    ...legendItem,
                    top: (gridTop + 20),
                    data:[chartData[i].seriesNames[0], chartData[i].seriesNames[1]]
	            });
            }

	        this.chart = this.$echarts.init(document.querySelector("#chartRiskPerformance"));
            console.log('chartOptions',this.chartOptions)
        },

        // 历史净值、回撤
        createNavAndBenchChart()
        {
	        getNavAndBenchAndDrawDown(this.fundType,this.fundCode)
	        .then(res =>
	        {
		        console.log('createNavAndBenchChart',res)
		        let resData = res.data;

		        if (resData.items.length)
		        {
			        //this.myChart.hideLoading();

			        //this.chartOption.legend.data[1].name = resData.items[0].benchName; // 设置lengend
			        // this.chartOption.series[1].name = resData.items[0].benchName;   // 设置series
                    this.benchIndex = [];
			        let indexNav = this.chartData.nav.order;
			        let indexDrawDown = this.chartData.drawDown.order;


			        resData.items.forEach(item =>
			        {
				        this.chartOptions.xAxis[indexNav].data.push(item.tradeDate);
				        this.chartOptions.series[indexNav*2].data.push(parseFloat(item.navadj));
				        this.chartOptions.xAxis[indexDrawDown].data.push(item.tradeDate);
				        this.chartOptions.series[indexDrawDown*2].data.push(parseFloat(item.drawdown));
				        this.benchIndex.push(parseFloat(item.bench));
				        //this.chartOptions.series[this.chartData.nav.order*2+1].data.push(parseFloat(item.bench));
			        });

			        // 转换基准数据 data[]/min
			        let minValue = Math.min.apply(null,this.benchIndex);
			        let transData;
			        this.benchIndex.forEach( item => {
				        transData = parseFloat((item/minValue).toFixed(4));
                        this.chartOptions.series[indexNav*2+1].data.push(transData);
				        this.chartOptions.series[indexDrawDown*2+1].data.push(transData);
                    });

			        //获取分析报告
			        let navReport = report.getNavInfo(this.chartOptions.series[indexNav*2].data,this.chartOptions.series[indexNav*2+1].data);
                    this.chartData.nav = {...this.chartData.nav,reportInfo:navReport};
                    console.log(this.chartData.nav);

			        let drawDownReport = report.getDrawDownInfo(this.chartOptions.series[indexDrawDown*2].data,this.chartOptions.xAxis[indexDrawDown].data);
			        this.chartData.drawDown = {...this.chartData.drawDown,reportInfo:drawDownReport};
			        console.log(this.chartData.drawDown)
			      /*  this.chartOptions.series[this.chartData.nav.order*2+1].tooltip ={
				        trigger: "axis",
			        	formatter: 'kddd'
			        };*/

			        this.chart.setOption(this.chartOptions);
			        console.log('createNavAndBenchChart,options',this.chartOptions)
		        }
	        });
        },

        // 上行月度收益
        createUplinkMonthReturnsChart()
        {
	        if(this.isCreatedShart.uplinkMonthReturns)
	        {
		        return false;
	        }
	        this.isCreatedShart.uplinkMonthReturns = true;
	        getUplinkMonthReturns(this.fundType,this.fundCode)
	        .then(res =>
	        {
		        console.log('UplinkMonthReturns',res)
		        let resData = res.data;
		        if (resData.items.length)
		        {
		        	let benchName = resData.items[0].benchName;
			        //this.chartOption.legend.data[1].name = benchName; // 设置lengend
			        // this.chartOption.series[1].name = benchName;   // 设置series
                    let index = this.chartData.uplinkMonth.order;
			        resData.items.forEach(item =>
			        {
				        this.chartOptions.xAxis[index].data.push(item.tradeDate);
				        this.chartOptions.series[index*2].data.push(parseFloat(item.monthEarn));
				        this.chartOptions.series[index*2+1].data.push(parseFloat(item.monthBench));
			        });

			        //获取分析报告
			        let reportInfo = report.getUplinkMonthReturnsInfo(
			        	this.chartOptions.series[index*2].data,
                        this.chartOptions.series[index*2+1].data,
				        benchName
                    );
			        this.chartData.uplinkMonth = {...this.chartData.uplinkMonth,reportInfo:reportInfo};

			        this.chart.setOption(this.chartOptions);
		        }
	        });
        },

	    // 下行月度收益
	    createDownlinkMonthReturnsChart()
	    {
		    if(this.isCreatedShart.downlinkMonthReturns)
		    {
			    return false;
		    }
		    this.isCreatedShart.downlinkMonthReturns = true;
		    getDownlinkMonthReturns(this.fundType,this.fundCode)
		    .then(res =>
		    {

			    console.log('DownlinkMonthReturns',res)
			    let resData = res.data;
			    if (resData.items.length)
			    {
				    let benchName = resData.items[0].benchName;
				    //this.chartOption.legend.data[1].name = resData.items[0].benchName; // 设置lengend
				    // this.chartOption.series[1].name = resData.items[0].benchName;   // 设置series
				    let index = this.chartData.downlinkMonth.order;
				    resData.items.forEach(item =>
				    {
					    this.chartOptions.xAxis[index].data.push(item.tradeDate);
					    this.chartOptions.series[index*2].data.push(parseFloat(item.monthEarn));
					    this.chartOptions.series[index*2+1].data.push(parseFloat(item.monthBench));
				    });
				    //获取分析报告
				    let reportInfo = report.getDownlinkMonthReturnsInfo(
					    this.chartOptions.series[index*2].data,
					    this.chartOptions.series[index*2+1].data,
					    benchName
				    );
				    this.chartData.downlinkMonth = {...this.chartData.downlinkMonth,reportInfo:reportInfo};
				    this.chart.setOption(this.chartOptions);
			    }
		    });
	    },


        //滚动收益率和波动率
        createRollingReturnsAndVolatitlyChart()
        {
	        if(this.isCreatedShart.returnsAndVolatility)
	        {
		        return false;
	        }
	        this.isCreatedShart.returnsAndVolatility = true;
	        getRollingReturnsAndVolatility(this.fundType,this.fundCode)
	        .then(res =>
	        {

	        	console.log('RollingReturnsAndVolatitly',res);
		        if (res.data.items.length)
		        {
		        	let index = this.chartData.returnsAndVolatitly.order;
			        res.data.items.forEach(item =>
			        {
				        this.chartOptions.xAxis[index].data.push(item.tradeDate);
				        this.chartOptions.series[index*2].data.push(item.rolEarn);
				        this.chartOptions.series[index*2+1].data.push(item.rolVolatility);
			        });

			        //获取分析报告
			        let reportInfo = report.getReturnsAndVolatilityInfo(
				        this.chartOptions.series[index*2].data,
				        this.chartOptions.series[index*2+1].data,
			        );
			        this.chartData.returnsAndVolatitly = {...this.chartData.returnsAndVolatitly,reportInfo:reportInfo};

			        this.chart.setOption(this.chartOptions);
		        }
	        });
        },

        //夏普比率和所提诺比率
        createSharpAndSortinoChart()
        {
        	console.log('buildSharpAndSortinoChart');
        	if(this.isCreatedShart.sharpAndSortino)    //避免页面滚动时重复创建
            {
            	return false;
            }
        	this.isCreatedShart.sharpAndSortino = true;
	        getSharpRatioAndSortinoRatio(this.fundType,this.fundCode)
	        .then(res =>
	        {
		        console.log('SharpAndSortinoChart',res);
		        if (res.data.items.length)
		        {
			        let index = this.chartData.sharpAndSortino.order;
			        res.data.items.forEach(item =>
			        {
				        this.chartOptions.xAxis[index].data.push(item.tradeDate);
				        this.chartOptions.series[index*2].data.push(item.rolSharpRatio);
				        this.chartOptions.series[index*2+1].data.push(item.rolSortinoRatio);
			        });
			        //获取分析报告
			        let reportInfo = report.getSharpRatioAndSortinoRatio(
				        this.chartOptions.series[index*2].data,
				        this.chartOptions.series[index*2+1].data,
			        );
			        this.chartData.sharpAndSortino = {...this.chartData.sharpAndSortino,reportInfo:reportInfo};

			        this.chart.setOption(this.chartOptions);
		        }
	        });
        },

        //页面滚动时，按需创建图表(懒加载)
        handleScroll()
        {
        	let scrollTop = document.querySelector('.risk-performance-wrapper').scrollTop;
        	//console.log(scrollTop )
            if(scrollTop > 400)
            {
            	this.createUplinkMonthReturnsChart();
            }
           if(scrollTop>700)
            {
            	this.createDownlinkMonthReturnsChart();
            }
           if(scrollTop>1100)
            {
            	this.createRollingReturnsAndVolatitlyChart();
            }
             if(scrollTop>1500)
            {
	            this.createSharpAndSortinoChart();
            }
        }
    },

    created()
    {
	    console.log('________________riskPerformance,created');
    	this.fundType = sessionStorage.getItem("type");
    	this.fundCode = sessionStorage.getItem("code");
    	this.getKeyStaticQuotasOfFundAndBench();
    	this.sortChartData();
        //console.log(this.chartOptions.grid)
    },

    mounted()
    {
    	console.log('_______________riskPerformance,mounted');
	    this.$nextTick(() => {
		    this.initChartOptions();
	    	this.createNavAndBenchChart();
	    });
    }

}


</script>

<style lang="less">

@import '../../styles/variables.less';

.risk-performance-wrapper
{

}

.static-quota
{

    .static-quota-content
    {
        padding: 25px 30px;
    }


    table
    {
        margin-bottom: 15px;
        width: 100%;
        border-spacing:0;
        border-collapse: collapse;
    }

    td
    {
        height: 40px;
        border: 1px solid #000;
        text-align: center;
    }
    .thead
    {
        color: #fff;
        background-color:#2f4554;
    }
}


.report-info
{
    padding: 10px;
    border:1px dashed #5c6b77;
    font-size: 14px;
    div
    {
        display:table-cell;
    }

    .report-info-icon
    {
        width:30px;
    }
}

.nav-header
{
    padding-left:15px;
    width: 100%;
    line-height: 40px;
    font-size: @font-size-base;
    color: @font-color-nav;
    background-color: #e4e7ed;
}


.charts-wrapper
{
    position: relative;
    height: 3500px;

    .chart-header
    {
        position: absolute;
    }

    .report-info-abs
    {
        position: absolute;
    }
}

.chart
{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height: inherit;
    //border: 1px solid;
}

</style>