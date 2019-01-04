<template>
    <div  @scroll="handleScroll">
        <div class="industry-style">

            <div class="chart-wraper" v-for="(value,key) in chartData">
                <div class="nav-header">{{ value.title }}</div>
                <div class="chart-main" :id= 'key' ></div>
                <div class="report-info" :style="{width:chartWidth + 'px', marginLeft: chartGridLeft+'px'}">
                    <div class="report-info-icon"><Icon type="md-arrow-dropup" /></div>
                    <div class="report-info-text" >{{ value.reportInfo }}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
	import  report from '@/libs/fundReport.js'

    import iaRollingOptions from './chart-options/iaRolling'
    import iaRollingDriftOptions from './chart-options/iaRollingDrift'
    import iaRelativeBenchmarkOptions from './chart-options/iaRelativeBenchmark'
    import iaValidityWeightedOptions from './chart-options/iaValidityWeighted'
	import iaValidityUnweightedOptions from './chart-options/iaValidityUnweighted'

    import chartCreate from '@/libs/fundCharts'


    export default {
	    data()
	    {
		    return {
			    //原始数据  行业配置：industry allocation = ia ; 风格因子style factor = sf
			    chartData:{
				    iaRolling: {chart: null, title: '滚动行业配置', options:iaRollingOptions},
				    iaRollingDrift: {chart: null,title: '行业配置滚动漂移',options:iaRollingDriftOptions },
				    iaRelativeBenchmark: {chart: null,title: '相对基准超额配置',options:iaRelativeBenchmarkOptions },
                    //iaAlphaR2: {chart: null, title: '行业配置alpha-R²',options:null},
				    iaValidityWeighted: {chart: null, title: '行业配置有效性(加权)',options:iaValidityWeightedOptions},
				    iaValidityUnweighted: {chart: null, title: '行业配置有效性(未加权)',options:iaValidityUnweightedOptions},
                },
                    /*
                    sfFulltime: {order: 5, type:'line',  seriesNames: ['夏普比率', '索提诺比率'], title: '全时段风格因子配置'},
	                sfDrift: {order: 6, type:'line',  seriesNames: ['夏普比率', '索提诺比率'], title: '风格因子配置滚动漂移'},
	                sfRelative: {order: 6, type:'line',  seriesNames: ['夏普比率', '索提诺比率'], title: '相对基准超额配置'},
	                sfAlpha: {order: 6, type:'line',  seriesNames: ['夏普比率', '索提诺比率'], title: '风格因子配置alpha-R²'},
	                sfEffective: {order: 6, type:'line',  seriesNames: ['夏普比率', '索提诺比率'], title: '风格因子配置有效性'},*/


			    chartWidth:1000, //图表实际宽度=grid+lenged=chartWrapper-gridleft-legendMarginRight
			    chartLegendWidth: 200,
			    chartComponentHeights:{header: 50, main: 350, bottom:180, mainToReport:80 },   //图表的各部分高度值
			    oneChartWrapperHeight: 0,   //一个图表的高度
			    chartGridLeft: 75,
			    chartGridRight: 30,
			    reportInfoTop: 0, //分析报告的div top
			    chart: null,

			    //图表是否已创建
			    isCreatedShart:
                {
                    iaRolling: false,
	                iaRollingDrift: false,
	                iaRelativeBenchmark: false,
	                iaAlphaR2: false,
	                iaValidityWeighted:false,
	                iaValidityUnweighted:false,
                },
			    fundType: '',
			    fundCode: ''

            }
        },

	    methods:
        {

	        //图标参数配置初始化：
	        initChartOptions()
	        {
		        let chartColorTarget = '#c23531', chartColorBench = '#2f4554';
		        let parentPageStyle = document.defaultView.getComputedStyle(document.querySelector('.fund-content'));
		        let parentElementStyle = document.defaultView.getComputedStyle(document.querySelector('.fund-content-tabs'));
		        console.log('fund-content width,',parentPageStyle.width);
		        let chartWrapperWidth;
		        chartWrapperWidth = parseInt(parentPageStyle.width) - 2 - 30
			        - parseInt(parentPageStyle.paddingLeft) - parseInt(parentPageStyle.paddingRight)
			        - parseInt(parentElementStyle.paddingLeft) - parseInt(parentElementStyle.paddingRight);
		        this.chartWidth = chartWrapperWidth - this.chartGridLeft;// - this.chartGridRight;
		        let gridWidth = this.chartWidth - this.chartLegendWidth;
                document.querySelectorAll('.chart-main').forEach((item)=>{item.style.width = chartWrapperWidth + 'px';})
                try
                {
	                for(let key in this.chartData)
	                {
		                this.chartData[key].chart = this.$echarts.init(document.querySelector('#' + key));
		                this.chartData[key].chart.setOption(this.chartData[key].options)
	                }
                }
                catch(e)
                {
	                console.log(e)
                }
		        console.log('industryAndStyle.chartData',this.chartData);
	        },

            //创建图表
            createChart(chartId)
            {
	            if(this.isCreatedShart[chartId])
	            {
		            return false;
	            }
	            this.isCreatedShart[chartId] = true;
	            let params =
                {
		            fundType: this.fundType,
		            fundCode: this.fundCode,
		            chart: this.chartData[chartId].chart,
		            options: this.chartData[chartId].options
	            };

	            chartCreate[chartId](params);
            },

	        handleScroll()
	        {

	        },
        },



	    created()
	    {
		    console.log('________________industryStyle,created');
		    this.fundType = sessionStorage.getItem("type");
		    this.fundCode = sessionStorage.getItem("code");
		   // this.sortChartData();
		    //console.log(this.chartOptions.grid)
	    },

	    mounted()
	    {
		    console.log('________________industryStyle,mounted');
		    this.$nextTick(() => {
			    this.initChartOptions();
                this.createChart('iaRolling');
			    this.createChart('iaRollingDrift');
                this.createChart('iaRelativeBenchmark');
                this.createChart('iaValidityWeighted');
                this.createChart('iaValidityUnweighted');
		    });
	    },

        updated()
        {
	        console.log('________________industryStyle,updated');
        },

	    destroyed()
        {
	        console.log('________________industryStyle,destroyed');
        }
    }

</script>


<style lang="less">

    @import '../../styles/variables.less';

    .industry-style
    {
        height: 3500px;
    }

    .chart-wraper
    {

        padding-bottom: 15px;
        .chart-main
        {
            margin: 15px 0;
            /*padding-right:30px;*/
            padding: 0 10px;
            width: 100%;
            height: 400px;
           // border:1px solid;
        }
    }



    .static-report
    {
        position: static;
    }

    #iaRolling
    {
        height: 400px;
    }


</style>