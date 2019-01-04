<template>
    <card-tmpl panel-title="常用应用" panel-icon="/images/module_icon_applications.png">
        <template slot="btn">
            <div class="app-panel__btn-wraper">

            </div>
        </template>
        <template slot="content">
            <div class="app-panel__content">
                <ul>
                    <li class="app-panel__item" v-for="(item,index) in appData" @click="handleClick(index)">
                        <img :src="item.img">
                        <br>
                        <span>{{ item.title }}</span>
                    </li>
                </ul>
                <div class="app-panel__system-wrapper">
                    <div class="app-panel__system-item-wrapper" v-for="(item,index) in systemData">
                        <a class="app-panel__system-item"> {{ item.title  }}</a>
                    </div>

                </div>
            </div>

        </template>
    </card-tmpl>
</template>

<script>
	import CardTmpl from './CardTemplate.vue'
   // import router from '@/router'

	var appData =
    [
        { img: '/images/application_icon_daysoff.png', title: '调休' },
        { img: '/images/application_icon_annualleave.png', title: '年假' },
        { img: '/images/application_icon_overtime.png', title: '加班' },
        { img: '/images/application_icon_travel.png', title: '出差' , path: 'business-trip'},
        { img: '/images/application_icon_leave.png', title: '请假' },
        { img: '/images/application_icon_general.png', title: '通用应用' },
        { img: '/images/application_icon_add.png', title: '增加' }
    ];
	var systemData =
    [
        { title: 'OA' },
        { title: 'IT项目管理'},
        { title: '人力资源'},
        { title: '审计管理'}
     /*   { title: '全员投入产出与资产管理'},
        { title: '蜂巢门户'}*/
    ];

	export default
	{
		components:{ CardTmpl },
		data()
		{
			return {
				appData,
				systemData
			};
		},

        methods:
        {
	        handleClick(index)
            {
            	let path  = '/flow/' + this.appData[index].path;
            	this.$router.push('/flow/business-trip')
            }

        }
	}
</script>

<style >

    .app-panel__btn-wraper
    {
        color: #e81118;
        font-size: 14px;
    }


    .app-panel__content
    {
        padding-left: 20px;
        padding-top: 15px;
        height: 400px;
    }

    ul
    {
        margin: 0;
        padding: 0;
        /*height: 160px;*/
        list-style-type: none;
    }

    .app-panel__item
    {
        float: left;
        padding-bottom: 20px;
        width: 20%;
        text-align: center;
        font-size: 14px;
        color: #666;
        cursor: pointer;
    }

    .app-panel__system-wrapper
    {
        margin-top: 10px;
        height: 200px;
        border-top: dotted 1px #333;
    }

    .app-panel__system-item-wrapper
    {
        float: left;
        margin-top: 20px;
        width: 50%;
        text-align: center;
    }


    .app-panel__system-item
    {

        display: inline-block;
        margin: 0 auto;
        padding-left: 15px;
        width: 80%;
        height: 70px;
        line-height: 70px;
        text-align: left;
        font-size: 16px;
        color: #666;
        background-color: #f8f8f8;
    }

</style>