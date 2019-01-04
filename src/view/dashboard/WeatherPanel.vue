<template>
    <card-tmpl panel-title="天气日历" panel-icon="/images/module_icon_weather.png" class="weather-panel">
        <template slot="btn">
            <div class="weather-panel__btn-wraper">

            </div>
        </template>
        <template slot="content">
           <div class="weather-panel__date-wrapper">
               <div style="margin: 0 auto;text-align: left; width:110px;">
                   <p>
                       <span class="weather-panel__date-number">8</span>
                       <span class="weather-panel__date-cn">月</span>
                       <span class="weather-panel__date-number">28</span>
                       <span class="weather-panel__date-cn">日</span>
                   </p>
                   <p><span>七月初十</span>&nbsp;<span>周二</span></p>
                   <p><i><img src="/images/weather_icon_location.png"></i>&nbsp;&nbsp;晴转多云</p>
                   <p><i><img src="/images/weather_icon_weather.png"></i>&nbsp;&nbsp;济南</p>
               </div>
           </div>
            <div class="weather-panel__oneday-wrapper">
                <div v-for="item in weatherData" style="float: left;width:33%;text-align: center">
                    <div class="weather-panel__oneday" >
                        <p>{{item.oneday}}</p>
                        <p>{{item.temperature}}</p>
                        <p class="weather-panel__info-img"><img :src="item.img"></p>
                    </div>
                </div>
            </div>
        </template>
    </card-tmpl>
</template>

<script>
	import CardTmpl from './CardTemplate.vue'

	var weatherData = [
		{
			oneday: '今天',
			temperature: '23℃/30℃',
			img: '/images/weather_pic_type_1.png'
		},
		{
			oneday: '明天',
			temperature: '20℃/31℃',
			img: '/images/weather_pic_type_2.png'
		},
		{
			oneday: '后天',
			temperature: '20℃/30℃',
			img: '/images/weather_pic_type_3.png'
		}
	];

	export default
	{
		components:{ CardTmpl },
		data()
		{
			return {
				weatherData
			};
		}
	}
</script>

<style>

    .weather-panel
    {
        color: #666;
        font-size: 14px;
    }

    .weather-panel__btn-wraper
    {

    }


    .weather-panel__content
    {
        padding-left: 20px;
        padding-top: 15px;
        height: 160px;
    }

    .weather-panel__date-wrapper,.weather-panel__oneday-wrapper
    {
        float: left;
    }

    .weather-panel__date-wrapper
    {
       /* margin-left: 40px;*/
        width: 33%;
        text-align: center;
    }

    .weather-panel__date-number
    {
        font-size: 30px;
    }

    .weather-panel__date-cn
    {
        font-size: 20px;
    }


    .weather-panel__oneday-wrapper
    {
        width: 66%;
        padding-top: 10px;
    }

    .weather-panel__oneday
    {

        margin: 0 auto;
        /*margin-left: 50px;*/
        width: 70px;
        text-align: center;
    }

    .weather-panel__info-img
    {
        padding-top: 10px;
    }

</style>