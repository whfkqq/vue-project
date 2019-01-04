<template>
    <card-tmpl panel-title="通知公告" panel-icon="/images/module_icon_announce.png">
        <template slot="btn">
            <div class="notice-panel__btn-wraper">
                更多
            </div>
        </template>
        <template slot="content">
            <ul class="notice-panel__content">
                <li class="notice-panel__item" v-for="(item,index) in noticeData">
                    <span class="notice-panel__item-title">{{index + 1}}.&nbsp{{item.title}}</span>
                    <span>[{{item.date}}]</span>
                </li>
            </ul>
        </template>
    </card-tmpl>
</template>

<script>
	import CardTmpl from './CardTemplate.vue'

	var noticeData = [
		{
			title: '关于资金管理系统承接股票期权资金类业务上线的通知',
            date: '2018-08-24'
		},
		{
			title: '关于公司党委常委工作分工调整的通知',
			date: '2018-08-22'
		},
		{
			title: '公司召开扶贫攻坚工作推进会',
			date: '2018-08-14'
		},
		{
			title: '公司党委举办中心组（扩大）学习会',
			date: '2018-08-04'
		},
		{
			title: '关于进一步提高CISP系统监管数据报送质量的通知',
			date: '2018-07-20'
		}
	];

	export default
	{
		components:{ CardTmpl },
		data()
		{
			return {
				noticeData: noticeData
			};
		}
	}
</script>

<style scoped>

    .notice-panel__btn-wraper
    {
        color: #e81118;
        font-size: 14px;
    }


    .notice-panel__content
    {
        padding-left: 20px;
        padding-top: 15px;
        height: 160px;
    }

    ul
    {
        margin: 0;
        padding: 0;
        height: 160px;
        list-style-type: none;
    }

    .notice-panel__item
    {
        line-height: 26px;
        font-size: 14px;
        color: #666;
    }

    .notice-panel__item span
    {
        /*display:inline-block;*/
        float:left;
        display: block;
        line-height: 26px;
    }

    .notice-panel__item-title
    {

        width: 79%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }


</style>