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
  import {getFactorallocationcapability} from '@/api/fundview'
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
    components: {

    },
    data() {
        return {
            myChart: null,
            factorallocationcapability: {
                title: {
                    text: "风格因子剥离象限图",
                    x: "center",
                    y: 0
                },
                tooltip: {
                    axisPointer: {
                        type: "cross"
                    },
                    formatter:(params) => {
                        return `${params.seriesName}: <br/>rsquare: ${params.value[0]} , alpha: ${params.value[1]}`
                    }
                },
                grid: [{ x: "7%", y: "7%", width: "80%", height: "80%" }],
                xAxis: [
                    {
                        type: "value",
                        name: "管理人能力(Alpha)",
                        nameLocation: "center",
                        nameGap: 50
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "行业解释力(Rsquare)",
                        nameLocation: "center",
                        nameGap: 30
                    }
                ],
                series: [
                    {
                        name: "风格因子",
                        type: "scatter",
                        xAxisIndex: 0,
                        yAxisIndex: 0,
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
            self.factorallocationcapabilityEcharts();
        });
    },
    methods: {
        factorallocationcapabilityEcharts() {
            let self = this;
            let type = sessionStorage.getItem("type");
            let code = sessionStorage.getItem("code");
            self.$echarts.registerTheme("theme", color);
            self.myChart = self.$echarts.init(
                document.getElementById("row"),
                "theme"
            );
            self.myChart.showLoading();
          getFactorallocationcapability(type,code)
                .then(res => {
                    self.myChart.hideLoading(); //隐藏加载动画
                    if (res.data.items.length) {
                        let data = res.data.items;
                        let len = res.data.items.length,i = len > 35000 ? 35000 : 0 , arr = [];
                        for(;i<len;i++){
                            arr.push([data[i].rsquare,data[i].alpha])
                        }
                        self.factorallocationcapability.series[0].data = arr;
                        self.myChart.setOption(self.factorallocationcapability,true);
                    } else self.$Modal.info({ body: "加载失败" });
                });
        },
        autoChartSize() {
          document.querySelector('.y-chart').style.height = (window.innerHeight - 165) + 'px';
        }
    }
};
</script>
