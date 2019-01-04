<template>
    <div class="fund-info">
            <div class="title-wrapper">
                <div class="title">{{baseInfo.productName}}</div>
                <div class="code">{{baseInfo.productCode}}</div>
                <div><Tag color="success">{{baseInfo.listedState | formatStatus}}</Tag></div>
            </div>
            <Row>
                <Col span="6">
                <div class="info-item"><span class="info-label">基金管理人</span>{{baseInfo.investManager}}</div>
                <div class="info-item"><span class="info-label">基金策略</span>{{baseInfo.investStrategy}}</div>
                </Col>
                <Col span="3">
                <div class="info-item"><span class="info-label">基金经理</span>{{baseInfo.fundManager}}</div>
                <div class="info-item"><span class="info-label">成立日期</span>{{baseInfo.startDate}}</div>
                </Col>
                <Col span="2">
                <div class="info-number">{{baseInfo.navadj}}</div>
                <div class="info-label-bot">单位净值</div>
                </Col>
                <Col span="2">
                <div class="info-number">{{baseInfo.accumNavadj}}</div>
                <div class="info-label-bot">累计净值</div>
                </Col>
                <Col span="3">
                <div class="info-number percentage"
                     :class="{'negative-color': isReturnsByYearNegative}">
                    {{baseInfo.annualYield | formatPercentage}}
                </div>
                <div class="info-label-bot">年化收益</div>
                </Col>
                <Col span="3">
                <div class="info-number percentage"
                     :class="{'negative-color': isReturnsThisYearNegative}">
                    {{baseInfo.yieldOfThisYear | formatPercentage}}
                </div>
                <div class="info-label-bot">今年收益</div>
                </Col>
            </Row>
    </div>
</template>

<script>

export default {
	props:
    {
	    baseInfo: Object
    },

    computed:
    {
    	// 判断年化收益率是否为负
	    isReturnsByYearNegative()
        {
            return (parseFloat(this.baseInfo.annualYield) < 0 ) ? true: false;
        },

	    // 判断今年收益率是否为负
	    isReturnsThisYearNegative()
	    {
		    return (parseFloat(this.baseInfo.yieldOfThisYear) < 0 ) ? true: false;
	    },

    },

    methods:
    {

    },

    filters:
    {
    	// 把基金状态由数值转换为文字描述
    	formatStatus(value)
        {
        	value = parseInt(value);
        	value = (value >=1 &&  value <=2) ? value : 0;
	        return ['未知', '运行中', '已清盘'][value];
        },

        // 格式化百分比数值：有百分号的去掉；没有百分号的乘以100
        formatPercentage(value)
        {
        	//console.log('formatPercentage',value)
        	let percentSignIndex = value.indexOf('%');
        	if(percentSignIndex >= 0)
            {
            	value = value.substr(0,percentSignIndex);
            }
            else
            {
	            value = parseFloat(value) * 100;
            }
            return value;
        }
    }
}


</script>

<style lang="less">
    @import '../../../styles/variables.less';

    .fund-info
    {
        padding:5px 20px 10px;
        font-size:@font-size-base;
        color:@font-color-normal;
        background-color: #fff;

    }

    .title-wrapper
    {
        height: 42px;
        & > div {
                float: left;
                height: inherit;
                line-height: 42px;
                /*border:1px solid;*/
            }

        .title
        {
            font-size: @font-size-large;

        }

        .code
        {
            padding-left: 15px;
            padding-right: 15px;
            font-size: @font-size-base;
        }

        .status
        {
            padding: 5px;
            background-color: @negative;
        }


    }

    Col
    {
        border:1px solid;
    }
    .info-item
    {
        line-height: 26px;
    }

    .info-label
    {
        color: @font-color-label;
    }

    .info-label:after
    {
        content:': '
    }

    .info-number
    {
        height: 30px;
        font-size: 28px;
        text-align: center;
    }

    .percentage
    {
        min-width: 120px;
        color: @positive;
    }

    .percentage:after
    {
        content: '%';
        font-size: @font-size-small;
        color:@font-color-normal;
    }

    .info-label-bot
    {
        color: @font-color-label;
        text-align: center;
    }

    .negative-color
    {
        color: @negative;
    }


</style>
