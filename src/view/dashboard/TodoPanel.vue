<template>
    <card-tmpl panel-title="我的工作" panel-icon="/images/module_icon_jobs.png">
        <template slot="btn">
            <div class="todo-panel__btn-wraper">
                <div>
                    <Input size="small" placeholder="查找日程" prefix-icon="el-icon-search" class="todo-panel__search"></Input>
                    <Button size="small" type="danger">添加</Button>
                </div>

            </div>
        </template>
        <template slot="content">
            <div class="todo-panel__content">
                <div class="todo-panel__content-header">
                    <a class="todo-panel__tab"
                       v-for="(item,index) in todoTabs"
                       @click="switchTab(index)"
                       :class="{'todo-panel__tab--selected': index === todoTabSelectedIndex}">
                        <span class="todo-panel__tab-title">{{ item.name }}</span>
                        <span class="todo-panel__tab-num" :style="{color: item.color}">{{ item.num }}</span>
                    </a>
                </div>
                <div class="todo-panel__tip" style="display: none;">
                    <div class="todo-panel__tip-img"><img src="/images/illustration_empty.jpg"></div>
                    <div class="todo-panel__tip-info">
                        <h3>待办日程</h3>
                        <p>1.处理系统流程</p>
                        <p>2.添加个人/他人日程，每周自动生成周报</p>
                        <p>3.E-learing学分计划</p>
                        <p>4.公司级任务（后续职业培养）</p>
                        <p class="todo-panel__tip-more"> 更多功能，等你发现~</p>
                        <div class="todo-panel__add-btn">+ 添加第一条日程</div>
                    </div>
                </div>

                <div>
                    <ul>
                       <li class="todo-panel-item-by-day">
                           <div class="todo-panel__datetime todo-panel__date">9月18日</div>
                           <ul class="todo-panel-item-list" >
                               <li class="todo-panel-item">
                                   <div class="todo-panel__datetime todo-panel__time">08:57</div>
                                   <div class="todo-panel-item-content" :style="{width:todoItemContentWidth + 'px'}">
                                       <h3 class="todo-panel__item-title">打印参加持帐行走活动报名名单</h3>
                                       <p class="todo-panel__item-info">活动时间：9月8日早上九点开始，迷你行程十点结束，高新区集合</p>
                                       <p class="todo-panel__item-tip">来源：我的备忘</p>
                                   </div>
                               </li>
                               <li class="todo-panel-item">
                                   <div class="todo-panel__datetime todo-panel__time">08:57</div>
                                   <div class="todo-panel-item-content" :style="{width:todoItemContentWidth + 'px'}">
                                       <h3 class="todo-panel__item-title">打印参加持帐行走活动报名名单</h3>
                                       <p class="todo-panel__item-info">活动时间：9月8日早上九点开始，迷你行程十点结束，高新区集合</p>
                                       <p class="todo-panel__item-tip">来源：我的备忘</p>
                                   </div>
                               </li>
                           </ul>
                       </li>

                        <li class="todo-panel-item-by-day">
                            <div class="todo-panel__datetime todo-panel__date">9月18日</div>
                            <ul class="todo-panel-item-list" >
                                <li class="todo-panel-item">
                                    <div class="todo-panel__datetime todo-panel__time">08:57</div>
                                    <div class="todo-panel-item-content" :style="{width:todoItemContentWidth + 'px'}">
                                        <h3 class="todo-panel__item-title">打印参加持帐行走活动报名名单</h3>
                                        <p class="todo-panel__item-info">活动时间：9月8日早上九点开始，迷你行程十点结束，高新区集合</p>
                                        <p class="todo-panel__item-tip">来源：我的备忘</p>
                                    </div>
                                </li>
                             <!--   <li class="todo-panel-item">
                                    <div class="todo-panel__datetime todo-panel__time">08:57</div>
                                    <div class="todo-panel-item-content" :style="{width:todoItemContentWidth + 'px'}">
                                        <h3 class="todo-panel__item-title">打印参加持帐行走活动报名名单</h3>
                                        <p class="todo-panel__item-info">活动时间：9月8日早上九点开始，迷你行程十点结束，高新区集合</p>
                                        <p class="todo-panel__item-tip">来源：我的备忘</p>
                                    </div>
                                </li>-->
                            </ul>
                        </li>

                    </ul>
                </div>

            </div>
        </template>
    </card-tmpl>
</template>

<script>
	import CardTmpl from './CardTemplate.vue'


    var todoTabs = [
        { name: '待办', num: 25, color: '#996699' },
	    { name: '收藏', num: 10, color: '#0099CC' },
	    { name: '历史', num: 68, color: '#990033' },
	    { name: '忽略', num: 15, color: '#003399' }
    ];

	export default
	{
		components:
        {
			CardTmpl
        },

		data()
		{
			return {
				todoTabs,
                todoTabSelectedIndex: 0,
				todoItemContentWidth:600
			};
		},

        methods:
        {
	        switchTab(index)
            {
                this.todoTabSelectedIndex = index;
            }
        },

        mounted()
        {
        	this.todoItemContentWidth = parseInt(document.querySelector('.todo-panel-item-by-day').clientWidth) - 170;
        }
	}
</script>

<style lang="less" >

    .todo-panel__btn-wraper
    {
        width: 250px;
        font-size: 14px;
    }

    .todo-panel__search
    {
        width: 160px;
        margin-right: 15px;
    }

    .todo-panel__content
    {
        height: 500px;
    }

    .todo-panel__content-header
    {
        padding-left: 20px;
        padding-top: 15px;
        height: 100px;
    }


    .todo-panel__item
    {
        line-height: 26px;
        font-size: 14px;
        color: #666;
    }

    .todo-panel__tab
    {
        display:block;
        float: left;
        margin-right: 20px;
        width: 140px;
        height: 45px;
        border-radius: 5px;
        background-color: #f2f2f2;
    }

    .todo-panel__tab:hover
    {
        background-color: #fbb040;
    }

    .todo-panel__tab--selected
    {
        color: #fff;
        background-color: #fbb040;
    }

    .todo-panel__tab--selected:after
    {
        position: relative;
        left: -63px;
        top: 40px;
        display: inline-block;
        border: 5px solid transparent;
        border-top-color: #fbb040;
        border-width: 15px 8px;
        content: "";
    }

    .todo-panel__tab--selected span
    {
        color: #fff;
    }


    .todo-panel__tab span
    {
        display: inline-block;
        float: left;
        color: inherit;
    }

    .todo-panel__tab-title
    {
        width: 26%;
        line-height: 30px;
        text-align: right;
        font-size: 12px;
        color: #333;
    }

    .todo-panel__tab-num
    {
        width: 60%;
        line-height: 45px;
        text-align: right;
        font-size: 26px;

    }

    .todo-panel__tip
    {
        display: flex;
        justify-content: center;
        height: 400px;
    }

    .todo-panel__tip-img
    {

        /*border: 1px solid;*/
    }

    .todo-panel__tip-info
    {
        margin-left: 70px;
        color: #333333;
        font-size: 16px;
        /*border: 1px solid;*/
    }

    .todo-panel__tip-more
    {
        line-height: 40px;
    }

    .todo-panel__add-btn
    {
        margin-top: 10px;
        width: 100%;
        line-height: 70px;
        text-align: center;
        border-radius: 5px;
        border:1px solid red;
    }


    .todo-panel__date
    {
        float: left;
        padding-top: 10px;
        width: 80px;
        text-align: center;
    }

    .todo-panel-item-list
    {
        float: left;
        height: 100%;
        border-left: 1px solid red;
    }

    .todo-panel-item
    {
        height: 120px;
    }

    .todo-panel__datetime
    {

        color: #333;
        font-size: 14px;
    }

    .todo-panel-item div
    {
        float: left;
    }

    .todo-panel__time
    {
        position: relative;

        padding-top: 10px;
        padding-left: 15px;
        width:70px;
    }

    .todo-panel__time:before
    {
        display: block;
        position: absolute;
        left: -5px;
        width:10px;
        height:10px;
        border-radius: 10px;
        border: 2px solid red;
        background-color: #fff;
        content:'';
    }

    .todo-panel-item-content
    {
        padding: 0 15px;
        background-color: #f2f2f2;
        border-radius: 10px;
    }

    .todo-panel__item-title
    {
        color: #373d41;
        font-size: 16px;
    }

    .todo-panel__item-info
    {
        color: #666;
        font-size: 14px;
    }

    .todo-panel__item-tip
    {
        color: #666;
        font-size: 12px;
    }





</style>