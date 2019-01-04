<template>
    <div class="content-wrapper">

            <div id="row" class='y-chart'></div>

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

import {getRollingIndustryAllocation} from '@/api/fundview'

export default {
    components: {

    },
    data() {
        return {
            myChart: null,
            scrollIndustryAndSotino: {
                title: {
                    text: "滚动行业配置",
                    left: "20"
                },
                tooltip: {
                    trigger: "axis",
                    confine:true
                },
                legend: {
                    data: [],
                    left: "center",
                    top: "top",
                    width:'80%',
                    itemWidth:28,
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
                grid: {
                    // tfop:'5%',
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                dataZoom: [
                    {
                        type: "inside",
                        realtime: true,
                        start: 90,
                        end: 100
                    },
                    {
                        realtime: true,
                        start: 90,
                        end: 100
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        max:1,//Y轴最大值 不写的话自动调节
                        axisLabel:{formatter:function(value){
                            return value*100 + '%'
                        }}
                    }
                ],
                series: []
            }
        };
    },
    mounted() {
        let self = this;
        self.autoChartSize();
        self.$nextTick(function() {
            self.scrollIndustryAndSotinoEcharts();
        });
    },
    methods: {
        scrollIndustryAndSotinoEcharts() {
            let self = this;
            let type = sessionStorage.getItem("type");
            let code = sessionStorage.getItem("code");
            self.$echarts.registerTheme("theme", color);
            self.myChart = self.$echarts.init(document.getElementById("row"),"theme");
            self.myChart.showLoading();
	        getRollingIndustryAllocation(type,code)
                .then(res => {
                    if (res.data) {
                        self.myChart.hideLoading(); //隐藏加载动画
                        for(let key in res.data){
                           self.scrollIndustryAndSotino.legend.data.push(key);
                           let arr = res.data[key];
                           let obj = {
                                name:key,
                                type:'line',
                                stack: '总量',
                                symbol: "none",
                                areaStyle: {normal: {}},
                                data:[]
                            };
                           arr.forEach(it => {
                               let i = self.scrollIndustryAndSotino.xAxis.data.findIndex(it1 => it1 == it.tradeDate);
                               if(i === -1) self.scrollIndustryAndSotino.xAxis.data.push(it.tradeDate);
                               obj.data.push(it.allocation);
                           })
                            self.scrollIndustryAndSotino.series.push(obj);
                        }
                        self.myChart.setOption(self.scrollIndustryAndSotino);
                    } else self.$Modal.info({ body: "加载失败" });
                });
        },
        autoChartSize() {
	        document.querySelector('.y-chart').style.height = (window.innerHeight - 165) + 'px';
        },
    }
};
</script>