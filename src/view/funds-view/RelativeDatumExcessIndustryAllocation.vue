<template>
    <div class="content-wrapper">
        <div id="industryConfiguration" class='y-chart'></div>
    </div>
</template>
<style lang='less' scoped>
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
</style>

<script>
import color from '@/components/charts/dark.json'
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

import {getRelativeDatumExcessIndustryAllocation} from '@/api/fundview'

export default {
    components: {

    },
    data() {
        return {
            myChart: null,
            relativelyBenchmark: {
                title: {
                    text: "相对基准超额配置",
                    left: "20"
                },
                legend: {
                    data: [],
                    left: "center",
                    top: "top",
                    width:'80%',
                    itemWidth:28,
                },
                backgroundColor: "#eee",
                brush: {
                    toolbox: [
                        "rect",
                        "polygon",
                        "lineX",
                        "lineY",
                        "keep",
                        "clear"
                    ],
                    xAxisIndex: 0
                },
                toolbox: {
                    feature: {
                        magicType: {
                            type: ["stack", "tiled"]
                        },
                        dataView: {}
                    }
                },
                tooltip: {},
                xAxis: {
                    data: [],
                    // name: "X Axis",
                    silent: false,
                    axisLine: { onZero: true },
                    splitLine: { show: false },
                    splitArea: { show: false }
                },
                dataZoom: [
                    {
                        type: "inside",
                        realtime: false,
                        start: 90,
                        end: 100
                    },
                    {
                        realtime: false,
                        start: 90,
                        end: 100
                    }
                ],
                yAxis: {
                    inverse: true,
                    splitArea: { show: false },
                    // max:1,//Y轴最大值 不写的话自动调节
                    axisLabel:{formatter:function(value){
                        return value*100 + '%'
                    }}
                },
                grid: {
                    left: 100
                },
                series: []
            }
        };
    },
    mounted() {
        let self = this;
        self.autoChartSize();
        self.$nextTick(function() {
            self.relativelyBenchmarkEcharts();
        });
    },
    methods: {
        relativelyBenchmarkEcharts() {
            let self = this;
            let type = sessionStorage.getItem("type");
            let code = sessionStorage.getItem("code");
            self.$echarts.registerTheme("theme", color);
            self.myChart = self.$echarts.init(
                document.getElementById("industryConfiguration"),
                "theme"
            );
            self.myChart.showLoading();
	        getRelativeDatumExcessIndustryAllocation(type,code)
                .then(res => {
                    if (res.data) {
                        self.myChart.hideLoading(); //隐藏加载动画
                        for(let key in res.data){
                           self.relativelyBenchmark.legend.data.push(key);
                           let arr = res.data[key];
                           let obj = {
                                name:key,
                                type: "bar",
                                symbol: "none",
                                data:[]
                            };
                           arr.forEach(it => {
                               let i = self.relativelyBenchmark.xAxis.data.findIndex(it1 => it1 == it.tradeDate);
                               if(i === -1) self.relativelyBenchmark.xAxis.data.push(it.tradeDate);
                               obj.data.push(it.allocation);
                           })
                            self.relativelyBenchmark.series.push(obj);
                        }
                        self.myChart.setOption(self.relativelyBenchmark);
                    } else self.$Modal.info({ body: "加载失败" });
                });
        },
        autoChartSize() {
	        document.querySelector('.y-chart').style.height = (window.innerHeight - 165) + 'px';
        }
    }
};
</script>