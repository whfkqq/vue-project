<template>
    <div>
        <div class="dataStyle">
            <DatePicker type="date" v-model="par.startDt"></DatePicker>
            &nbsp;至&nbsp;
            <DatePicker type="date" v-model="par.endDt"></DatePicker>
            &nbsp;<Button type="info" icon="ios-search" @click='redrawEcharts'>搜索</Button>
        </div>
        <!-- <section class="content"> </section>-->
        <div id="chart" class='y-chart'></div>

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

    }
</style>

<script>

	import color from '@/components/charts/dark.json'
	import {getNavAndBenchAndDrawDown} from '@/api/fundview'


	let month_3 = new Date();
	month_3.setDate(month_3.getDate() - 20);


	export default {
		components: {},
		data() {
			return {
				myChart: null,
				par: {
					startDt: month_3.Format("yyyy-MM-dd"),
					endDt:  new Date().Format("yyyy-MM-dd")
				},
				chartOption: {
					title: {
						text: "历史净值",
						left: "30"
					},
					legend: {
						//data: ["净值", "基准"],
                        data: [
                        	{name:'净值',textStyle:{color:'#f00'}},
	                        {name:'基准',textStyle:{color:'#00f'}},
                        	],
                        orient: 'vertical',
						right: 20,
                        top: 'middle'
					},
					/*tooltip: {
						trigger: "axis"
					},*/
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},

					dataZoom: [
						{
							type: "inside",
							start: 70,
							end: 100
						},
						{
							type: 'slider',
							start: 70,
							end: 100
						}
					],

                    grid:{
						width: '70%'
                    },

					xAxis: {
						type: "category",
						data: []
					},

					yAxis: [
						{
							type: "value",
                            min: 'dataMin',
                            name: '净值',
                            nameLocation: 'middle',
                            nameGap: 30,
                            nameRotate: 45,
                            nameTextStyle:{color:'#f00'},
							//axisLine: {lineStyle:{color:'#f00'}}, //轴线颜色
                            axisLabel: {color: '#f00'} //刻度标签
						},
						{
							type: "value",
							min: 'dataMin',
                            name: '基准',
							nameLocation: 'middle',
							nameGap: 45,
							nameRotate: 45,
							nameTextStyle:{color:'#00f'},
							//axisLine: {lineStyle:{color:'#00f'}}
							axisLabel: {color: '#00f'}

						}
					],

					series: [
						{
							name: "净值",
							type: "line",
							symbol: "none",
                            itemStyle: {normal:{color:'#f00'}},
							data: [],
							tooltip: {
								trigger: "axis"
							}
						},
						{
							name: "基准",
							type: "line",
							symbol: "none",
							yAxisIndex: 1,
							itemStyle: {normal:{color:'#00f'}},
							data: [],
							tooltip: {
								trigger: "axis"
							}
						}
					]
				}
			};
		},

		mounted() {
			this.autoChartSize();
			this.$nextTick(() => {this.buildChart();});
		},
		methods: {
			buildChart() {
				let self = this;
				let type = sessionStorage.getItem("type");
				let code = sessionStorage.getItem("code");


				self.$echarts.registerTheme("theme", color);
				//self.myChart = self.$echarts.init(document.getElementById("chart"),"theme");
				self.myChart = self.$echarts.init(document.getElementById("chart"));
				self.myChart.showLoading();

				getNavAndBenchAndDrawDown(type,code)
				.then(res => {
					let resData = res.data;
					if (resData.items.length) {
						self.myChart.hideLoading();

						self.chartOption.legend.data[1].name = resData.items[0].benchName; // 设置lengend
						self.chartOption.series[1].name = resData.items[0].benchName;   // 设置series

						resData.items.forEach(item => {
							self.chartOption.xAxis.data.push(item.tradeDate);
							self.chartOption.series[0].data.push(parseFloat(item.navadj));
							self.chartOption.series[1].data.push(parseFloat(item.bench));
						});

						self.myChart.setOption(self.chartOption);
					}
					else{
						self.$Modal.info({ body: "加载失败" });
                    }

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
				self.chartOption.xAxis.data = [],self.chartOption.series[0].data=[],self.chartOption.series[1].data=[];
				getRollearnAndVolatility(type,code,startDate,endDate)
				.then(res => {
					if (res.data.items.length) {
						res.data.items.forEach(item => {
							self.chartOption.xAxis.data.push(item.tradeDate);
							self.chartOption.series[0].data.push(parseFloat(item.navadj));
							self.chartOption.series[1].data.push(parseFloat(item.bench));
						});
						self.myChart.setOption(self.chartOption);
					}
					else {
                    	self.$Modal.info({ body: "加载失败" });
                    }
				});
			}
		}
	};
</script>