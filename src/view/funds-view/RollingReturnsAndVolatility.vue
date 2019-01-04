<template>
    <div>
        <div class="dataStyle">
                <DatePicker type="date" v-model="par.startDt"></DatePicker>
                &nbsp;至&nbsp;
                <DatePicker type="date" v-model="par.endDt"></DatePicker>
                &nbsp;<Button type="info" icon="ios-search" @click='redrawEcharts'>搜索</Button>
        </div>
       <!-- <section class="content"> </section>-->
            <div id="row" class='y-chart'></div>

    </div>
</template>
<style lang='less' scoped>
.positionStyle {
    position: relative;
    left: 475px;
    top: -34px;
}
.dataStyle {
    padding-left: 30px;
    height: 40px;
}
.content {
    position: relative;

    & > div {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
}

.y-chart
{
    width: 80%;
    border:1px solid;
}
</style>

<script>

import color from '@/components/charts/dark.json'
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

import {getRollingReturnsAndVolatility} from '@/api/fundview'


let month_3 = new Date();
month_3.setDate(month_3.getDate() - 20);


export default {
    components: {
        //echartsHeader
    },
    data() {
        return {
            myChart: null,
            par: {
                startDt: month_3.Format("yyyy-MM-dd"),
                endDt:  new Date().Format("yyyy-MM-dd")
            },
            fluctuation: {
                title: {
                    text: "滚动收益与波动表现",
                    left: "30"
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["滚动收益率", "滚动波动率"],
                  //  left: "center",
                  //  padding: [10, 0, 0, 0]
                    //right:-100
                    //x: 'right',
                    //y: 'center',
                    top:'center',
                    right:30,
                    width:'500',
                    orient:'vertical'
                },

	            grid:
		            {
			            show:true,
			            width:'70%',
			            backgroundColor:'#ffc',
			            containLabel:true,

		            },

                xAxis: {
                    type: "category",
                    data: []
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom: [
                    {
                        type: "inside",
	                    realtime: true,
                        start: 30,
                        end: 70
                    },
                    {
	                    type: "slider",
                       realtime: true,
                       /* start: 0,
                        end: 10*/
                    }
                ],
                yAxis: [
                    {
                        type: "value"
                    },
                    {
                    	type: "value"
                    }
                ],
                series: [
                    {
                        name: "滚动收益率",
                        type: "line",
                        symbol: "none",
                        data: []
                    },
                    {
                        name: "滚动波动率",
                        type: "line",
	                    yAxisIndex: 1,
                        symbol: "none",
                        data: []
                    }
                ]

            }
        };
    },
    mounted() {
        let self = this;
        self.autoChartSize();
        self.$nextTick(function() {
            self.fluctuationEcharts();
        });
    },
    methods: {
        fluctuationEcharts() {
            let self = this;
            let type = sessionStorage.getItem("type");
            let code = sessionStorage.getItem("code");
            let endDate = new Date().Format("yyyy-MM-dd");
            self.$echarts.registerTheme("theme", color);
	        //self.myChart = self.$echarts.init(document.getElementById("row"), "theme");
	        self.myChart = self.$echarts.init(document.getElementById("row"));
            self.myChart.showLoading();
	        getRollingReturnsAndVolatility(type,code)
                .then(res => {
                    if (res.data.items.length) {
                        self.myChart.hideLoading(); //隐藏加载动画
                        console.log(self.fluctuation);
                       /* let name = res.items[0].benchName,
                            streamName = sessionStorage.getItem("name"),
                            arr = Array.from([name, streamName]);*/
                        res.data.items.forEach(it => {
                            self.fluctuation.xAxis.data.push(it.tradeDate);
                            self.fluctuation.series[0].data.push(it.rolEarn);
                            self.fluctuation.series[1].data.push(
                                it.rolVolatility
                            );
                        });
                        let itemStyle = {
                            normal: {},
                            emphasis: {
                                barBorderWidth: 1,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: "rgba(0,0,0,0.5)"
                            }
                        };
                        self.myChart.setOption(self.fluctuation);
                    }
                    else
                    	self.$Modal.info({ body: "加载失败" });
                });
        },
        autoChartSize() {
	        document.querySelector('.y-chart').style.height = (window.innerHeight - 165) + 'px';
        },
        redrawEcharts() {
        	console.log('redrawEcharts')
            let self = this;
            let type = sessionStorage.getItem("type");
            let code = sessionStorage.getItem("code");
            let startDate = self.par.startDt.Format("yyyy-MM-dd");
            let endDate = self.par.endDt.Format("yyyy-MM-dd");
            self.fluctuation.xAxis.data = [],self.fluctuation.series[0].data=[],self.fluctuation.series[1].data=[];
	        getRollearnAndVolatility(type,code,startDate,endDate)
                .then(res => {
                    if (res.data.items.length) {
                        res.data.items.forEach(it => {
                            self.fluctuation.xAxis.data.push(it.tradeDate);
                            self.fluctuation.series[0].data.push(it.rolEarn);
                            self.fluctuation.series[1].data.push(
                                it.rolVolatility
                            );
                        });
                        self.myChart.setOption(self.fluctuation);
                    } else self.$Modal.info({ body: "加载失败" });
                });
        }
    }
};
</script>