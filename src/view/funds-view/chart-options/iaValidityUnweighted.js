/**
 * Created by wangchy on 2018/11/23.
 */

/*
 * 行业配置有效性(未加权)
 * */
export default
{

	grid: {
		// height: "50%",
		left:150,
		top:10
	},

	xAxis: {

		type: "category",
		data: [],
		splitArea: {
			show: true
		},
		axisLabel: {
			interval: 0,
			formatter: function (value)
			{
				return value.split("").join("\n");
			}
		}
	},

	yAxis: {
		type: "category",
		data: [],
		splitArea: {
			show: true
		}

	},

	series: [
		{
			name: "Punch Card",
			type: "heatmap",
			data: [],
			label: {
				normal: {
					show: true
				}
			},
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowColor: "rgba(0, 0, 0, 0.5)"
				}
			}
		}
	],

	tooltip: {
		position: "top"
	},
	animation: false,

	visualMap: {
		left: "93%",
		top: "10%",
		min: -0.0001,
		max: 0.001,
		itemWidth: 30,
		itemHeight: 300,
		calculable: true,
		precision: 0.0001,
		text: ["有效性调整"],
	},
	dataZoom: [
		{
			type: "slider",
			show: true,
			yAxisIndex: [0],
			left: "3%",
			start: 0,
			end: 10
		}
	]


}