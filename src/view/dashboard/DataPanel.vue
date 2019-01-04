<template>
    <card-tmpl panel-title="数据展板" panel-icon="/images/module_icon_statistics.png">
        <template slot="btn">
            <div class="data-panel__btn-wraper">
                <div></div>
                <div></div>
            </div>
        </template>
        <template slot="content" class="data-panel__content">
            <ul class="data-panel__item-list">
                <li class="data-panel__item-wrapper" v-for="item in operatingData">
                    <div class="data-panel__item">
                        <div class="data-panel__item-top">
                            <div class="data-panel__item-left">
                                <div class="data-panel__number">{{item.num}}<span class="data-panel__unit">{{item.unit}}</span></div>
                                <div class="data-panel__info">{{item.info}}</div>
                            </div>
                            <div class="data-panel__item-right">
                                {{item.percent}}%
                                <img src="images/statistics_icon_up.png" v-if="item.isUp">
                                <img src="/images/statistics_icon_down.png" v-if="!item.isUp">
                            </div>
                        </div>
                        <div class="data-panel__item-bottom">
                            <div :style="{'background-color':item.color}"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </template>
    </card-tmpl>
</template>

<script>
import CardTmpl from './CardTemplate.vue'

var operatingData = [
	{
		num: 82,
		unit: '%',
		percent: '12.5',
		isUp: true,
		info: '团队人数',
		color: '#27aae1'
	},
	{
		num: 8222,
		unit: '元',
		percent: '1.8',
		isUp: false,
		info: '费用支出(百万)',
		color: '#fbb040',
	},
	{
		num: 17,
		unit: '%',
		percent: '0.09',
		isUp: true,
		info: '风险控制',
		color: '#be1e2d'
	},
	{
		num: 5,
		unit: '个',
		percent: '36.9',
		isUp: false,
		info: '项目管理',
		color: '#37af89'
	}
];

export default
{
	components:{ CardTmpl },
	data()
	{
		return {
			operatingData: operatingData
		};
	}
}
</script>

<style>

    .data-panel__btn-wraper
    {
        padding-right:20px;
    }
    .data-panel__btn-wraper div
    {
        display: inline-block;
        width: 16px;
        height: 16px;

        border-radius: 8px;
        background-color: #99a9bf;
    }

    .data-panel__content
    {
        height: 160px;
    }

    .data-panel__item-list
    {
        margin: 0;
        padding: 0;
        height: 160px;
        list-style-type: none;

    }

    .data-panel__item-wrapper
    {
        float: left;
        margin-top: 20px;
        width: 25%;
        height: 100px;
        text-align: center;
    }

    .data-panel__item
    {
        margin:0 auto;
        width:170px;
        height:100%;
    }

    .data-panel__item-top
    {
        height: inherit;
    }

    .data-panel__item-left,.data-panel__item-right
    {
        float: left;
    }

    .data-panel__item-left
    {
        width: 106px;
    }

    .data-panel__item-right
    {
        padding-top: 10px;
        color: #ff0000;
    }


    .data-panel__number
    {
        font-size: 36px;
        color: #333;

    }

    .data-panel__unit
    {
        font-size: 16px;
    }

    .data-panel__info
    {
        line-height: 36px;
        font-size: 14px;
        color: #666;
    }

    .data-panel__item-bottom
    {
        height: 5px;
        background-color: #e2e2e2;
        border-radius: 3px;
    }

    .data-panel__item-bottom div
    {
        width:70%;
        height: inherit;
        border-radius: 3px;
        background-color: #27aae1;
    }
</style>