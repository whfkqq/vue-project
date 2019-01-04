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

    .y-chart
    {
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

import {getFulltimeIndustryAllocation} from '@/api/fundview'

export default {
    components: {

    },
    data() {
        return {
            myChart: null,
            industryConfiguration: {
                title: {
                    text: "全时段行业配置",
                    x: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    // type: 'scroll',
                    orient: "vertical",
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: [],
                    selected: {}
                },
                series: [
                    {
                        name: "行业",
                        type: "pie",
                        radius: "60%",
                        center: ["40%", "50%"],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            }
        };
    },
    mounted() {
        let self = this;
        self.autoChartSize();
        self.$nextTick(function() {
            self.industryConfigurationEcharts();
        });
    },
    methods: {
        industryConfigurationEcharts() {
            let self = this;
            let type = sessionStorage.getItem("type");
            let code = sessionStorage.getItem("code");
            self.$echarts.registerTheme("theme", color);
            self.myChart = self.$echarts.init(
                document.getElementById("industryConfiguration"),
                "theme"
            );
            self.myChart.setOption(self.industryConfiguration);
            self.myChart.showLoading();
	        getFulltimeIndustryAllocation(type,code)
                .then(res => {
                    if (res.data.items.length) {
                        self.myChart.hideLoading(); //隐藏加载动画
                        res.data.items.forEach((it,index) => {
                            self.industryConfiguration.legend.data.push(it.industryName);
                            self.industryConfiguration.legend.selected[it.industryName] = index < 10;
                            self.industryConfiguration.series[0].data.push({
                                name:it.industryName,
                                value:it.allocation
                            })
                        });
                        self.myChart.setOption(self.industryConfiguration);
                    } else self.$Modal.info({ body: "加载失败" });
                });
        },
        autoChartSize() {
	        document.querySelector('.y-chart').style.height = (window.innerHeight - 165) + 'px';
        }
    }
};
</script>