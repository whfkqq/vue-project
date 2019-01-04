/**
 * Created by wangchy on 2018/11/23.
 */

/*
 * 相对基准超额配置
 * */
export default
{
	grid: {
		left: 75,
		top:10,
		width: '70%',
	},
	xAxis: {
		data: [],
		silent: false,
		axisLine: { onZero: true },
		splitLine: { show: false },
		splitArea: { show: false }
	},
	yAxis: {
		inverse: true,
		splitArea: { show: false },
		// max:1,//Y轴最大值 不写的话自动调节
		axisLabel:{formatter:function(value){
			return value*100 + '%'
		}}
	},

	series: [],
	legend: {
		//borderWidth:1,
		orient: "vertical",
		data: [],
		right: 10,
		top: 20,
		width:'80%',
		itemWidth:28,
	},
	//backgroundColor: "#eee",
	tooltip: {},

	dataZoom: [
		{
			type:'slider',
			realtime: false,
			start: 90,
			end: 100
		}
	]

}