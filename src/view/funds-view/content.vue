<template>
   <div class="fund-content" :style="{height: pageHeight + 'px'}">
        <div class="base-info-wrapper" :style="{width: pageContentWidth + 'px'}">
            <fund-info :base-info="baseInfo"></fund-info>
        </div>
        <div class="fund-content-tabs" :style="{width: pageContentWidth + 'px',height: tabsHeight + 'px'}">
            <Tabs>
                <TabPane label="风险绩效指标" name="">
                    <risk-perfomance ref="riskTab" class="main" :style="{height: tabsMainHeight + 'px'}" ></risk-perfomance>
                </TabPane>
                <TabPane label="持仓分析" name="">

                </TabPane>
                <TabPane label="行业&风格分析" name="">

                   <!-- <industry-style ref="industryTab" class="main" :style="{height: tabsMainHeight + 'px'}" ></industry-style>-->

                </TabPane>

                <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" slot="extra"></DatePicker>
            </Tabs>
        </div>
    </div>
</template>

<script>

	import color from '@/components/charts/dark.json'
	import FundInfo from '../components/fund-info/FundInfo.vue'
    import RiskPerfomance from './RiskPerformance.vue'
    import IndustryStyle from './industryAndStyle.vue'

	export default {
        components:{FundInfo,RiskPerfomance,IndustryStyle},

		data() {
			return {
				pageHeight: 600, //本页面的高度
				pageContentWidth:1000, //本页面的宽度
				tabsHeight: 578,  //tabs容器的高度
				tabsMainHeight: 510, //tabs内容元素的高度

				baseInfo:
                {
                }

			};
		},

        created()
        {
	        console.log('_______________________content-created')
        },
        mounted()
        {
        	console.log('________________________content-mounted')
            this.$nextTick(()=>{this.getDomHeight();})
            console.log("params",this.$route.params)
            this.baseInfo = this.$route.params;
        	window.onresize = this.handleResize;
        },

		methods:
        {
        	//计算父元素的padding高度、整个页面高度、tabs容器高度、tabs内容高度
            getDomHeight()
            {
            	try
	            {
		            let outHeaderHeight = 1; //118;     //外网网站的头部高度
                    let outSliderWidth = 256; //219
		            let parentNodeStyle = document.defaultView.getComputedStyle(document.querySelector('.fund-content').parentNode);    //main.vue页面
		            let parentPaddingHeight = parseInt(parentNodeStyle.paddingTop) + parseInt(parentNodeStyle.paddingBottom);
		            this.pageHeight = window.innerHeight - outHeaderHeight - parentPaddingHeight;

		            //为了显示阴影，base-info-wrapper、fund-content-tabs的宽度不能使用默认值即100%，必须手动减去几个像素
		            let pageContentWidth = parseInt(document.defaultView.getComputedStyle(document.querySelector('.fund-content')).width);
                    console.log('fund-content width',pageContentWidth);
		            this.pageContentWidth = pageContentWidth - 2;

		            //tabs容器的高度
		            let fundBaseInfoHeight = parseInt(document.defaultView.getComputedStyle(document.querySelector('.base-info-wrapper')).height);
		            let tabsNodeStyle = document.defaultView.getComputedStyle(document.querySelector('.fund-content-tabs'));
		            let tabsMargin = parseInt(tabsNodeStyle.marginTop) + parseInt(tabsNodeStyle.marginBottom);
		            this.tabsHeight = this.pageHeight - fundBaseInfoHeight - tabsMargin;

		            //tabs内容元素的高度
		            let tabsHeaderNodeStyle = document.defaultView.getComputedStyle(document.querySelector('.ivu-tabs-bar'));
		            let tabsHeaderHeight = parseInt(tabsHeaderNodeStyle.height)
			            + parseInt(tabsHeaderNodeStyle.marginTop)
                        + parseInt(tabsHeaderNodeStyle.marginBottom);
		            this.tabsMainHeight = this.tabsHeight - tabsHeaderHeight;

		            console.log('fund-content height,', this.pageHeight);
		            console.log('tabsHeight,', this.tabsHeight);
		            console.log('tabsMainHeight,', this.tabsMainHeight);
	            }
	            catch(e)
                {
                	console.log(e)
                }
            },

	        handleResize()
            {
            	console.log('handleResize');
            	//this.getDomHeight();
            	//this.$refs.riskTab.adjustWidthHeight();
            }
        }

    }

</script>

<style lang='less' >
@import '../../styles/variables';

    .fund-content
    {
     //   height: 730px;
        background-color: @page-background-color;
        overflow-y: hidden;
    }

    .base-info-wrapper
    {
        height:110px;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.5);
    }

    .fund-content-tabs
    {
        margin-top: 15px;
        margin-bottom: 5px;
        padding-left: 20px;
        //padding-right: 5px;
        //height: 578px;
        background-color: #fff;
        box-shadow: 0px 1px 2px 0 rgba(0,0,0,0.5);

        .main
        {
            /*height:510px;*/
            overflow-y: auto;
            overflow-x: hidden;
        }

        .ivu-tabs-nav-right
        {
            margin-top: 9px;
        }

        .tabs-content-header
        {
            padding-left: 10px;
            line-height: 40px;
            background-color: #eee;
        }

        .tabs-content-header1
        {
            position: absolute;
            top: 200px;
            width: 100%;
            line-height: 40px;
            background-color: #eee;
        }


        .nav-bench
        {
            position: relative;

        }

        .chart
        {
           /*height: 800px;*/
        }
    }


    .fund-content-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab{
        padding-top:0;
        padding-bottom: 0;
        line-height: 50px;
        /*background-color: #666;*/
        /*border: 1px solid;*/
    }




</style>