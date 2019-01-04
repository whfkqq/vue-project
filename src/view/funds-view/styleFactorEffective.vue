<template>
  <div class="content-wrapper">
    <echarts-header></echarts-header>
    <section class="content">
      <div id="upstream" class='y-chart'></div>
    </section>
  </div>
</template>
<style lang='less' scoped>
  .content {
    position: relative;
    height: 800px;
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
  import {getFactorallocationvalidityweighted} from '@/api/fundview'
  import color from '@/components/charts/dark.json'

  require("echarts/lib/chart/line");
  require("echarts/lib/chart/bar");
  // 引入提示框和标题组件
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");

  export default {
    components: {},
    data() {
      return {
        myChart: null,
        styleFactorEffective: {
          title: {
            text: "风格因子配置有效性(加权)",
            left: "center"
          },
          tooltip: {
            position: "top"
          },
          animation: false,
          grid: {
            bottom: "35%",
            // y: "10%"
          },
          xAxis: {
            type: "category",
            data: [],
            splitArea: {
              show: true
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                return value.split("").join("\n");
              }
            }
          },
          yAxis: {
            type: "category",
            data: [],
            splitArea: {
              show: true
            }
          },
          visualMap: {
            left: "93%",
            top: "5%",
            min: -0.0001,
            max: 0.001,
            itemWidth: 30,
            itemHeight: 450,
            calculable: true,
            precision: 0.0001,
            text: ["有效性调整"],
          },
          dataZoom: [
            {
              type: "slider",
              show: true,
              realtime: false,
              yAxisIndex: [0],
              left: "3%",
              start: 98,
              end: 100
            },
            {
              type: "inside",
              realtime: false,
              yAxisIndex: [0],
              start: 98,
              end: 100
            }
          ],
          series: [
            {
              name: "Punch Card",
              type: "heatmap",
              data: [],
              label: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        },
        dataName: {
          SIZE: "规模",
          BETA: "贝塔",
          MOMENTUM: "动量反转",
          RV: "残差波动",
          NL_SIZE: "非线性市值",
          BTOP: "账面市值比",
          LIQUIDITY: "流动性",
          EARNING_YIELD: "盈利预期",
          GROWTH: "成长",
          LEVERAGE: "杠杆"
        }
      };
    },
    created() {
    },
    mounted() {
      let self = this;
      self.autoChartSize();
      self.styleFactorEffectiveEcharts();
      window.addEventListener(
        "resize",
        function () {
          self.autoChartSize();
        },
        true
      );
    },
    methods: {
      styleFactorEffectiveEcharts() {
        let self = this;
        self.$echarts.registerTheme("color", color);
        self.myChart = self.$echarts.init(
          document.getElementById("upstream"), 'color'
        );
        self.myChart.showLoading();
        getFactorallocationvalidityweighted(sessionStorage.getItem("type"), sessionStorage.getItem("code"))
          .then(res => {
            if (res.data) {
              let arr1 = [];
              self.myChart.hideLoading(); //隐藏加载动画
              for (let key in res.data) {
                let arr = res.data[key], str = `${key}${self.dataName[key]}`;
                self.styleFactorEffective.xAxis.data.push(str);
                arr.forEach((it, index) => {
                  let i = self.styleFactorEffective.yAxis.data.findIndex(
                    it1 => it1 == it.tradeDate
                  );
                  if (i === -1)
                    self.styleFactorEffective.yAxis.data.push(
                      it.tradeDate
                    );
                  arr1.push([
                    str,
                    it.tradeDate,
                    it.validityWeighted
                  ]);
                });
              }
              arr1 = arr1.map(function (item) {
                if (item[2] == '0.0000') item[2] = '-';
                return [item[0], item[1], item[2]];
              });
              self.styleFactorEffective.series[0].data = arr1;
              self.myChart.setOption(self.styleFactorEffective);
            } else self.$Modal.info({body: "加载失败"});
          });
      },
      autoChartSize() {
        document.querySelector('.y-chart').style.height = (window.innerHeight - 165) + 'px';
      }
    }
  };
</script>
