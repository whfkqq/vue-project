/**
 * Created by wangchy on 2018/11/22.
 */

export default
{

	grid: {
	    left: 75,
		top:10,
		width: '70%',
		//borderWidth:1,
		backgroundColor:'#ccc',
		//containLabel: true
	},
	xAxis: {
		type: "category",
		data: []
	},
	yAxis: [
		{
			type: "value",
			max:1,//Y轴最大值 不写的话自动调节
			axisLabel:{formatter:function(value){
				return value*100 + '%'
			}}
		}
	],
	series: [],
	legend: {
		//borderWidth:1,
		orient: "vertical",
		right: 10,
		top: 10,
		height:330,
		itemWidth:28,
		data: []
	},
	tooltip: {
		trigger: "axis",
		confine:true
	},
	dataZoom: [
		{
			type: "slider",
			realtime: true,
			start: 90,
			end: 100
		}
	],
}