/**
 * Created by wangchy on 2018/11/23.
 */

/*
* 滚动行业配置（全时段行业配置）
* */
export default
{

	series: {
		name: "行业",
		type: "pie",
		radius: "150",
		center: ["40%", "50%"],
		data: [],
		itemStyle: {
			emphasis: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: "rgba(0, 0, 0, 0.5)"
			}
		}
	},

	legend: {
		//borderWidth:1,
		orient: "vertical",
		right: 10,
		top: 20,
		bottom: 20,
		data: [],
		selected: {}
	},

	tooltip: {
		trigger: "item",
		formatter: "{a} <br/>{b} : {c} ({d}%)"
	},


}